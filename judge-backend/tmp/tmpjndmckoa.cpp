#include <iostream>
#include <string>

int main() {
    int m, n, k;
    std::cin >> m >> n >> k;
    for(int i = 0; i < m; i++) {
        std::string l;
        std::cin >> l;
        std::string newline = "";
        for(char letter : l) {
            newline += std::string(k, letter);
        }
        for(int j = 0; j < k; j++) {
            std::cout << newline << std::endl;
        }
    }
    return 0;
}