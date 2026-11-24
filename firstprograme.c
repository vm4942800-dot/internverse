#include<stdio.h>
#include<stdlib.h>
#include<time.h>

int main() {
    int randam, guess;
    int no_of_guess = 0;
    srand(time(NULL));

    printf("Welcome to the world of guessing number\n");
    randam = rand() % 100 + 1; // generating between 1 and 100
    
do {
    printf("\nPlease enter your guess between (1 to 100): ");
    scanf("%d", &guess); 
    no_of_guess++;

    if (guess < randam ) {
        printf("guess a larger number, \n");
    } else if (guess > randam) {
        printf("Guess a smaller number.\n");
    } else {
        printf("Congratulations! You guessed the number in %d attempts. \n", no_of_guess);
        printf("Thanks for playing guessing number game\n");
    }
} while (guess != randam);

    return 0;
}