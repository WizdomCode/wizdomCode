export const TEMPLATES = [
  {
    "id": 1,
    "parent": 0,
    "droppable": true,
    "text": "Python"
  },
  {
    "id": 2,
    "parent": 0,
    "droppable": true,
    "text": "Java"
  },
  {
    "id": 3,
    "parent": 0,
    "droppable": true,
    "text": "C++"
  },
  {
    "id": 4,
    "parent": 1,
    "text": "Depth-First Search (DFS)",
    "data": {
        "language": 'python',
        "code": "python dfs template"
    }
  },
  {
    "id": 5,
    "parent": 3,
    "text": "Depth-First Search (DFS)",
    "data": {
        "language": 'cpp',
        "code": `void dfs(vector<vector<int>>& graph, vector<bool>& visited, int node) {
    visited[node] = true;
    cout << "Visited node: " << node << endl;

    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(graph, visited, neighbor);
        }
    }
}`
    }
  },
  {
    "id": 6,
    "parent": 2,
    "text": "Depth-First Search (DFS)",
    "data": {
        "language": 'java',
        "code": "java dfs template"
    }
  },
  {
    "id": 7,
    "parent": 3,
    "text": "Breadth-First Search (BFS)",
    "data": {
        "language": 'cpp',
        "code": `void bfs(vector<vector<int>>& graph, vector<bool>& visited, int startNode) {
    queue<int> q;
    q.push(startNode);
    visited[startNode] = true;

    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << "Visited node: " << node << endl;

        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`
    }
  },
  {
    "id": 8,
    "parent": 3,
    "text": "Merge Sort",
    "data": {
        "language": 'cpp',
        "code": `void merge(vector<int>& arr, int left, int mid, int right) {
  int n1 = mid - left + 1;
  int n2 = right - mid;

  // Create temporary arrays
  vector<int> L(n1), R(n2);

  // Copy data to temporary arrays L[] and R[]
  for (int i = 0; i < n1; i++)
      L[i] = arr[left + i];
  for (int j = 0; j < n2; j++)
      R[j] = arr[mid + 1 + j];

  // Merge the temporary arrays back into arr[left..right]
  int i = 0, j = 0, k = left;
  while (i < n1 && j < n2) {
      if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
      } else {
          arr[k] = R[j];
          j++;
      }
      k++;
  }

  // Copy the remaining elements of L[], if any
  while (i < n1) {
      arr[k] = L[i];
      i++;
      k++;
  }

  // Copy the remaining elements of R[], if any
  while (j < n2) {
      arr[k] = R[j];
      j++;
      k++;
  }
}

void mergeSort(vector<int>& arr, int left, int right) {
  if (left < right) {
      // Find the middle point
      int mid = left + (right - left) / 2;

      // Sort first and second halves
      mergeSort(arr, left, mid);
      mergeSort(arr, mid + 1, right);

      // Merge the sorted halves
      merge(arr, left, mid, right);
  }
}`
    }
  },
  {
    "id": 9,
    "parent": 3,
    "text": "Quick Sort",
    "data": {
        "language": 'cpp',
        "code": `int partition(vector<int>& arr, int low, int high) {
  int pivot = arr[high];
  int i = low - 1; // Index of smaller element

  for (int j = low; j < high; j++) {
      // If current element is smaller than the pivot
      if (arr[j] < pivot) {
          i++;
          swap(arr[i], arr[j]);
      }
  }
  swap(arr[i + 1], arr[high]);
  return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
  if (low < high) {
      // Partition index
      int pi = partition(arr, low, high);

      // Separate elements before and after partition
      quickSort(arr, low, pi - 1);
      quickSort(arr, pi + 1, high);
  }
}`
    }
  },
  {
    "id": 10,
    "parent": 3,
    "text": "Counting Sort",
    "data": {
        "language": 'cpp',
        "code": `void countingSort(vector<int>& arr) {
    int max_element = *max_element(arr.begin(), arr.end());
    int min_element = *min_element(arr.begin(), arr.end());
    int range = max_element - min_element + 1;

    vector<int> count(range), output(arr.size());

    // Count the number of occurrences of each element
    for (int i = 0; i < arr.size(); i++)
        count[arr[i] - min_element]++;

    // Modify the count array such that each element at each index
    // stores the sum of previous counts
    for (int i = 1; i < count.size(); i++)
        count[i] += count[i - 1];

    // Build the output array
    for (int i = arr.size() - 1; i >= 0; i--) {
        output[count[arr[i] - min_element] - 1] = arr[i];
        count[arr[i] - min_element]--;
    }

    // Copy the output array to the original array
    for (int i = 0; i < arr.size(); i++)
        arr[i] = output[i];
}`
    }
  },
  {
    "id": 11,
    "parent": 3,
    "text": "Dijkstra's Algorithm",
    "data": {
        "language": 'cpp',
        "code": `void dijkstra(vector<vector<pair<int, int>>>& graph, int source) {
    int numNodes = graph.size();
    vector<int> distance(numNodes, numeric_limits<int>::max());
    distance[source] = 0;
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;
    pq.push({0, source});

    while (!pq.empty()) {
        int u = pq.top().second;
        int dist_u = pq.top().first;
        pq.pop();

        if (dist_u > distance[u])
            continue;

        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (distance[u] + weight < distance[v]) {
                distance[v] = distance[u] + weight;
                pq.push({distance[v], v});
            }
        }
    }

    cout << "Shortest distances from source node " << source << ":\n";
    for (int i = 0; i < numNodes; ++i) {
        cout << "Node " << i << ": " << distance[i] << endl;
    }
}`
    }
  },
  {
    "id": 12,
    "parent": 3,
    "text": "Floyd-Warshall Algorithm (All-Pairs Shortest Path)",
    "data": {
        "language": 'cpp',
        "code": `void floydWarshall(vector<vector<int>>& graph) {
    int numNodes = graph.size();

    // Initialize distance matrix with graph's adjacency matrix
    vector<vector<int>> dist(graph);

    // Update distances using all intermediate nodes
    for (int k = 0; k < numNodes; ++k) {
        for (int i = 0; i < numNodes; ++i) {
            for (int j = 0; j < numNodes; ++j) {
                if (dist[i][k] != numeric_limits<int>::max() && dist[k][j] != numeric_limits<int>::max() &&
                    dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    // Output shortest distances
    cout << "Shortest distances between all pairs of vertices:\n";
    for (int i = 0; i < numNodes; ++i) {
        for (int j = 0; j < numNodes; ++j) {
            if (dist[i][j] == numeric_limits<int>::max()) {
                cout << "INF ";
            } else {
                cout << dist[i][j] << " ";
            }
        }
        cout << endl;
    }
}`
    }
  }
];
