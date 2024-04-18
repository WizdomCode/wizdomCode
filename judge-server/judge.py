import sys
import subprocess
import io
import tempfile
import os
import re
import time
import signal
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import queue
import threading

# Initialize Flask app and enable Cross-Origin Resource Sharing (CORS)
app = Flask(__name__)
CORS(app)

"""
The specific functions used in your code, such as signal.signal and signal.alarm, are not supported on Windows. 
Therefore, this code will work on Unix environments like Linux and MacOS, but it will not work on Windows.

"""

# Define a custom exception for handling timeouts
class TimeoutException(Exception): pass

# This function raises a TimeoutException when called by a signal
def handler(signum, frame):
    raise TimeoutException()

# This function executes a given function with a time limit
def execute_with_time_limit(func, args, time_limit):
    # Set the signal handler and a time limit
    signal.signal(signal.SIGALRM, handler)
    signal.alarm(time_limit)
    try:
        # Try to execute the function within the time limit
        res = func(*args)
        # If execution finishes within the time limit, cancel the alarm
        signal.alarm(0)
        return res
    except TimeoutException:
        # If time limit is exceeded, return a specific message
        return 'Time limit exceeded'
    except Exception as e:
        # If any other exception occurs, return its string representation
        return str(e)

# This function compiles and executes code for multiple test cases
def execute_code(code, test_cases, language, time_limit):
    results = []
    compiled_code = None
    
    # The same code is run against different test cases; 
    # there is a need to compile the code before the first test case but never again.
    if language == 'python':
        compiled_code = compile(code, '<string>', 'exec')
    elif language in ['java', 'cpp']:
        compiled_code = compile_code(code, language)

    # Execute the compiled code for each test case
    for test_case in test_cases:
        key = test_case['key']
        input_data = str(test_case['input'])
        expected_output = str(test_case['output']).replace('\r', '')

        # Measure the execution time
        start_time = time.time()
        if language == 'python':
            result = execute_with_time_limit(execute_python_code, (compiled_code, input_data), time_limit)
        elif language == 'java':
            result = execute_with_time_limit(execute_java_code, (compiled_code, input_data), time_limit)
        elif language == 'cpp':
            result = execute_with_time_limit(execute_cpp_code, (compiled_code, input_data), time_limit)
        else:
            result = 'Unsupported lang ' + language
        execution_time = time.time() - start_time

        # Normalize the result
        result = result.replace('\r', '')

        # Determine the status of the result
        status = {'description': 'Accepted', 'id': 1} if result.strip() == expected_output.strip() else {'description': 'Wrong Answer', 'id': 2}
        if result == 'Time limit exceeded':
            status = {'description': 'Time limit exceeded', 'id': 3}

        # Append the result to the results list
        results.append({'key': key, 'status': status, 'stdout': result, 'time': execution_time})

    return results

# This function compiles code for Java and C++
def compile_code(code, language):
    if language == 'java':
        class_name = re.search(r'class (\w+)', code).group(1)
        with tempfile.TemporaryDirectory(dir="/tmp") as temp_dir:
            java_file_name = os.path.join(temp_dir, f"{class_name}.java")
            with open(java_file_name, 'w') as java_file:
                java_file.write(code)
            compile_result = subprocess.run(
                ['javac', java_file_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE
            )
            if compile_result.returncode != 0:
                return compile_result.stderr.decode()
            return temp_dir, class_name
    elif language == 'cpp':
        with tempfile.NamedTemporaryFile(suffix=".cpp", dir="/tmp", delete=False) as cpp_file:
            cpp_file.write(code.encode())
            cpp_file_name = cpp_file.name
        compile_result = subprocess.run(
            ['g++', cpp_file_name, '-o', cpp_file_name[:-4]],
            stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        if compile_result.returncode != 0:
            return compile_result.stderr.decode()
        return cpp_file_name[:-4]

# This function executes Python code
def execute_python_code(compiled_code, input_data):
    # Save the original stdin and stdout
    original_stdin = sys.stdin
    original_stdout = sys.stdout
    # Redirect stdin and stdout to custom streams
    sys.stdin = io.StringIO(input_data)
    sys.stdout = output_capture = io.StringIO()

    try:
        # Execute the compiled code
        exec(compiled_code)
        # Capture the output
        output = output_capture.getvalue()
        return output
    except Exception as e:
        # If an exception occurs, return its string representation
        return str(e)
    finally:
        # Restore the original stdin and stdout
        sys.stdin = original_stdin
        sys.stdout = original_stdout

# This function executes Java code
def execute_java_code(compiled_code, input_data):
    temp_dir, class_name = compiled_code
    try:
        # Run the Java program with the input data
        run_result = subprocess.Popen(
            ['java', '-classpath', temp_dir, class_name], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        output, _ = run_result.communicate(input=input_data.encode())
        return output.decode()
    except Exception as e:
        return str(e)

# This function executes C++ code
def execute_cpp_code(compiled_code, input_data):
    try:
        # Run the C++ program with the input data
        run_result = subprocess.Popen(
            [compiled_code], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        output, _ = run_result.communicate(input=input_data.encode())
        return output.decode()
    except Exception as e:
        return str(e)

# Initialize a queue for requests and a list for results
request_queue = queue.Queue()
results = []

# This function is executed by worker threads
def worker():
    while True:
        # Get a request from the queue
        item = request_queue.get()
        if item is None:
            break
        language, code, test_cases, time_limit = item
        # Execute the code for the request and append the result to the results list
        result = execute_code(code, test_cases, language, time_limit)
        results.append(result)
        # Mark the task as done
        request_queue.task_done()

# Start worker threads
num_worker_threads = 4
for i in range(num_worker_threads):
    t = threading.Thread(target=worker)
    t.daemon = True
    t.start()

# Define a route for executing code
@app.route('/execute', methods=['POST'])
def execute():
    # Get the data from the request
    data = request.get_json()
    
    # Data is received in this format: { language: "", code: "", test_cases: [{ key: 1, input: "", output: ""},...]}
    # Example:
    """
    {"language":"cpp","code":"#include <iostream>\n\nint main() {\n  std::cout << \"Hello from C++!\" << std::endl;\n  return 0;\n}","test_cases":[{"input":"2\n9\n5\n","output":67,"key":1},{"key":2,"input":"103\n22\n497\n","output":2882},{"output":31,"input":"2\n0\n5\n","key":3},{"key":4,"output":42,"input":"2\n9\n0\n"},{"input":"0\n0\n0\n","output":0,"key":5}]}
    """
    
    # Extract the language, code, test cases, and time limit from the data
    language = data.get('language', 'python')
    code = data.get('code', '')
    test_cases = data.get('test_cases', [])
    time_limit = data.get('time_limit', 5)  # Default time limit is 5 seconds

    # Put the request in the queue
    request_queue.put((language, code, test_cases, time_limit))
    
    # Return a response indicating that the request is being processed
    return jsonify({'message': 'Request received and is being processed'})

# Run the Flask app on port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
