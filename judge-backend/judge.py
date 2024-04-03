import sys
import subprocess
import io
import tempfile
import os
import re
import time
import signal
import json

TIME_LIMIT = 5

class TimeoutException(Exception): pass

def handler(signum, frame):
    raise TimeoutException()

if os.name == 'nt':
    def execute_with_time_limit(func, args):
        from threading import Thread
        res = [None]
        def target():
            try:
                res[0] = func(*args)
            except Exception as e:
                res[0] = str(e)
        thread = Thread(target=target)
        thread.start()
        thread.join(TIME_LIMIT)
        if thread.is_alive():
            return 'Time limit exceeded'
        return res[0]
else:
    signal.signal(signal.SIGALRM, handler)
    def execute_with_time_limit(func, args):
        signal.alarm(TIME_LIMIT)
        try:
            res = func(*args)
            signal.alarm(0)
            return res
        except TimeoutException:
            return 'Time limit exceeded'
        except Exception as e:
            return str(e)

def execute_code(code, test_cases, language):
    results = []
    compiled_code = None

    if language == 'python':
        compiled_code = compile(code, '<string>', 'exec')
    elif language in ['java', 'cpp']:
        compiled_code = compile_code(code, language)

    for test_case in test_cases:
        key = test_case['key']
        input_data = test_case['input']
        expected_output = test_case['output'].replace('\r', '')

        start_time = time.time()
        if language == 'python':
            result = execute_with_time_limit(execute_python_code, (compiled_code, input_data))
        elif language == 'java':
            result = execute_with_time_limit(execute_java_code, (compiled_code, input_data))
        elif language == 'cpp':
            result = execute_with_time_limit(execute_cpp_code, (compiled_code, input_data))
        else:
            result = 'Unsupported lang ' + language
        execution_time = time.time() - start_time

        result = result.replace('\r', '')

        status = {'description': 'Accepted', 'id': 1} if result.strip() == expected_output.strip() else {'description': 'Wrong Answer', 'id': 2}
        if result == 'Time limit exceeded':
            status = {'description': 'Time limit exceeded', 'id': 3}

        results.append({'key': key, 'status': status, 'stdout': result, 'time': execution_time})

    return results

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

def execute_python_code(compiled_code, input_data):
    original_stdin = sys.stdin
    sys.stdin = io.StringIO(input_data)
    original_stdout = sys.stdout
    sys.stdout = output_capture = io.StringIO()

    try:
        exec(compiled_code)
        output = output_capture.getvalue()
        return output
    except Exception as e:
        return str(e)
    finally:
        sys.stdin = original_stdin
        sys.stdout = original_stdout

def execute_java_code(compiled_code, input_data):
    temp_dir, class_name = compiled_code
    try:
        run_result = subprocess.Popen(
            ['java', '-classpath', temp_dir, class_name], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        output, _ = run_result.communicate(input=input_data.encode())
        return output.decode()
    except Exception as e:
        return str(e)

def execute_cpp_code(compiled_code, input_data):
    try:
        run_result = subprocess.Popen(
            [compiled_code], stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )
        output, _ = run_result.communicate(input=input_data.encode())
        return output.decode()
    except Exception as e:
        return str(e)

def execute(event, context):
    language = event.get('language', 'python')
    code = event.get('code', '')
    test_cases = event.get('test_cases', [])
    
    print(f"Event: {event}")
    print(f"Context: {context}")
    
    results = execute_code(code, test_cases, language)
    return {
        'statusCode': 200,
        'headers': { 'Content-Type': 'application/json' },
        'body': json.dumps(results)
    }

