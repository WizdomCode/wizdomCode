#include <iostream>
#include <algorithm>

using namespace std;

struct Milk {
    int price;
    int amount;
};

bool compareMilk(Milk a, Milk b) {
    return a.price < b.price;
}

int main() {
    int N, M;
    cin >> N >> M;
    Milk milks[M];
    for (int i = 0; i < M; i++) {
        cin >> milks[i].price >> milks[i].amount;
    }
    sort(milks, milks + M, compareMilk);
    int totalCost = 0;
    for (int i = 0; i < M; i++) {
        if (N >= milks[i].amount) {
            totalCost += milks[i].price * milks[i].amount;
            N -= milks[i].amount;
        } else {
            totalCost += milks[i].price * N;
            break;
        }
    }
    cout << totalCost << endl;
    return 0;
}
