/*
ID: victor4
PROG: milk
LANG: C++
*/
#include <iostream>
#include <string>

using namespace std;

#define MAXCOSTS 1001

int main() {
 
 int req, farmers;
 cin >> req >> farmers;
 
 int available[MAXCOSTS] = {0};
 for(int i = 0; i < farmers; ++i){
  int price, amt;
  cin >> price >> amt;
  available[price % MAXCOSTS] += amt;
 }
 
 int cost = 0;
 for(int i = 0; i < MAXCOSTS; ++i){
  if(available[i]){
   if(available[i] >= req){
    cost += i * req;
    break;
   }
   else{
    cost += i * available[i];
    req -= available[i];
   }
  }
 }
 
 cout << cost << endl;
 return 0;
}
