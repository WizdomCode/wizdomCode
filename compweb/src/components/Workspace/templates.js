export const TEMPLATE_CODE = {
    'Depth-First Search (DFS)': {
      cpp:
`void dfs(vector<vector<int>>& graph, vector<bool>& visited, int node) {
    visited[node] = true;
    cout << "Visited node: " << node << endl;

    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfs(graph, visited, neighbor);
        }
    }
}`,
      python:
`python dfs template`,
      java:
`java dfs template`
    },
    'Breadth-First Search (BFS)': {
      cpp:
`void bfs(vector<vector<int>>& graph, vector<bool>& visited, int startNode) {
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
    },
    'Merge Sort': {
      cpp:
`void merge(vector<int>& arr, int left, int mid, int right) {
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
}` },
  'Quick Sort': {
    cpp: 
`int partition(vector<int>& arr, int low, int high) {
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
  },
'Counting Sort': {
    cpp:
`void countingSort(vector<int>& arr) {
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
},
'Dijkstra\'s Algorithm': {
    cpp: 
`void dijkstra(vector<vector<pair<int, int>>>& graph, int source) {
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
},
'Floyd-Warshall Algorithm (All-Pairs Shortest Path)': {
    cpp: 
`void floydWarshall(vector<vector<int>>& graph) {
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
},
'Topological Sorting': {
    cpp:
`void dfsTopoSort(vector<vector<int>>& graph, vector<bool>& visited, stack<int>& topoOrder, int node) {
    visited[node] = true;
    for (int neighbor : graph[node]) {
        if (!visited[neighbor]) {
            dfsTopoSort(graph, visited, topoOrder, neighbor);
        }
    }
    topoOrder.push(node);
}

vector<int> topologicalSort(vector<vector<int>>& graph) {
    int numNodes = graph.size();
    vector<bool> visited(numNodes, false);
    stack<int> topoOrder;

    for (int i = 0; i < numNodes; ++i) {
        if (!visited[i]) {
            dfsTopoSort(graph, visited, topoOrder, i);
        }
    }

    vector<int> result;
    while (!topoOrder.empty()) {
        result.push_back(topoOrder.top());
        topoOrder.pop();
    }
    return result;
}`
},
'Prim\'s Algorithm': {
    cpp:
`int primMST(vector<vector<pair<int, int>>>& graph) {
    int numNodes = graph.size();
    vector<bool> inMST(numNodes, false);
    vector<int> key(numNodes, numeric_limits<int>::max());
    key[0] = 0;
    int minCost = 0;

    for (int count = 0; count < numNodes - 1; ++count) {
        int u = -1;
        for (int v = 0; v < numNodes; ++v) {
            if (!inMST[v] && (u == -1 || key[v] < key[u])) {
                u = v;
            }
        }

        inMST[u] = true;
        minCost += key[u];

        for (auto& edge : graph[u]) {
            int v = edge.first;
            int weight = edge.second;
            if (!inMST[v] && weight < key[v]) {
                key[v] = weight;
            }
        }
    }
    return minCost;
}`
},
'Kruskal\'s Algorithm': {
    cpp:
`class DisjointSet {
    public:
        DisjointSet(int n) : parent(n), rank(n, 0) {
            for (int i = 0; i < n; ++i) {
                parent[i] = i;
            }
        }
    
        int find(int u) {
            if (parent[u] != u) {
                parent[u] = find(parent[u]);
            }
            return parent[u];
        }
    
        void unite(int u, int v) {
            int pu = find(u);
            int pv = find(v);
    
            if (pu == pv)
                return;
    
            if (rank[pu] < rank[pv]) {
                parent[pu] = pv;
            } else if (rank[pv] < rank[pu]) {
                parent[pv] = pu;
            } else {
                parent[pu] = pv;
                rank[pv]++;
            }
        }
    
    private:
        vector<int> parent;
        vector<int> rank;
    };
    
    int kruskalMST(vector<vector<pair<int, int>>>& graph) {
        int numNodes = graph.size();
        DisjointSet ds(numNodes);
        int minCost = 0;
    
        for (int u = 0; u < numNodes; ++u) {
            for (auto& edge : graph[u]) {
                int v = edge.first;
                int weight = edge.second;
    
                int setU = ds.find(u);
                int setV = ds.find(v);
    
                if (setU != setV) {
                    minCost += weight;
                    ds.unite(setU, setV);
                }
            }
        }
    
        return minCost;
    }
}`
},
'Array': {
    cpp:
`vector<int> arr = {1, 2, 3, 4, 5};`
},
'List': {
    cpp:
`list<int> lst = {1, 2, 3, 4, 5};`
},
'Stack': {
    cpp:
`stack<int> stk;
stk.push(1);
stk.push(2);
stk.push(3);`
},
'Queue': {
    cpp:
`queue<int> que;
que.push(1);
que.push(2);
que.push(3);`
},
'Priority Queues (Heaps)': {
    cpp:
`priority_queue<int> pq;
pq.push(3);
pq.push(1);
pq.push(2);`
},
'Hash Tables': {
    cpp:
`unordered_map<string, int> hashTable;
hashTable["apple"] = 5;
hashTable["banana"] = 7;
hashTable["orange"] = 3;`
},
'Adjacency Matrix': {
    cpp:
`vector<vector<int>> adjMatrix = {
    {0, 1, 0, 1},
    {1, 0, 1, 0},
    {0, 1, 0, 1},
    {1, 0, 1, 0}
};`
},
'Adjacency List': {
    cpp:
`vector<vector<int>> adjList = {
    {1, 3},
    {0, 2},
    {1, 3},
    {0, 2}
};`
},
'Bellman-Ford Algorithm': {
    cpp:
`void bellmanFord(vector<Edge>& edges, int numNodes, int source) {
    vector<int> distance(numNodes, numeric_limits<int>::max());
    distance[source] = 0;

    // Relax all edges (numNodes - 1) times
    for (int i = 0; i < numNodes - 1; ++i) {
        for (const auto& edge : edges) {
            int u = edge.source;
            int v = edge.destination;
            int weight = edge.weight;
            if (distance[u] != numeric_limits<int>::max() && distance[u] + weight < distance[v]) {
                distance[v] = distance[u] + weight;
            }
        }
    }

    // Check for negative-weight cycles
    for (const auto& edge : edges) {
        int u = edge.source;
        int v = edge.destination;
        int weight = edge.weight;
        if (distance[u] != numeric_limits<int>::max() && distance[u] + weight < distance[v]) {
            cout << "Graph contains negative-weight cycle!" << endl;
            return;
        }
    }

    // Print shortest distances
    cout << "Shortest distances from source node " << source << ":\n";
    for (int i = 0; i < numNodes; ++i) {
        cout << "Node " << i << ": " << distance[i] << endl;
    }
}`
},
'Binary Search': {
    cpp:
`int binarySearch(const vector<int>& nums, int target) {
    int low = 0;
    int high = nums.size() - 1;

    while (low <= high) {
        int mid = low + (high - low) / 2;

        if (nums[mid] == target)
            return mid; // Element found at index mid
        else if (nums[mid] < target)
            low = mid + 1; // Search in the right half
        else
            high = mid - 1; // Search in the left half
    }

    return -1; // Element not found
}`
},
'Memoization': {
    cpp:
`unordered_map<int, int> memo;

int fib(int n) {
    // Base case
    if (n <= 1)
        return n;

    // Check if result already exists in memoization table
    if (memo.find(n) != memo.end())
        return memo[n];

    // Compute and memoize the result
    int result = fib(n - 1) + fib(n - 2);
    memo[n] = result;
    return result;
}`
}
  }; 