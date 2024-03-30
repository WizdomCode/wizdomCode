#include <iostream>
#include <string>

int main() {
    std::string input;
    while (std::getline(std::cin, input)) {
        std::cout << input << std::endl;
    }
    return 0;
}
