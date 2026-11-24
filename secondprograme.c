#include<stdio.h>
#include<time.h>
#include<string.h>

static char buffer[50];

void fill_time_str(char*, int);
void fill_date_str(char*, int);
time_t raw_time;
struct tm *current_time;
void display_time(char*);

int main(){
    char time_str [100], date_str[100];
    fill_time_str(time_str, 1);
    fill_date_str(date_str, 1);
    int format_choice;
    printf("welcome to the Time Display Program!\n");
printf("/nChoose the time format you want to display:\n");
printf("1. 12-hour format (default)\n");
printf("2. 24-hour format\n");
printf("Enter your choice (1 or 2): ");
    int choice;
    scanf("%d", &choice);
    fill_time_str(time_str, choice);

    time_t raw_time;
    struct tm *current_time;
    time(&raw_time);

    current_time = localtime(&raw_time);
    strftime(buffer, sizeof(buffer),
     "%I:%M:%S %p", current_time);

    printf("CURRENT TIME: %s\n", buffer);
       

    return 0;
}


void fill_time_str(char buffer[], int format_choice){
    time_t raw_time;
    struct tm *current_time;
    
    time(&raw_time);
    current_time = localtime(&raw_time);
    if(format_choice == 2){
        strftime(buffer, sizeof(buffer), "%H:%M:%S", current_time);
    } else {
    strftime(buffer, sizeof(buffer), "%I:%M:%S %p", current_time);
    }
}

void fill_date_str(char buffer[], int format_choice){
    time_t raw_time;
    struct tm *current_date;
    time(&raw_time);
    current_date = localtime(&raw_time);
    strftime(buffer, sizeof(buffer), "%A:%B:%d:%Y", current_date);






}

