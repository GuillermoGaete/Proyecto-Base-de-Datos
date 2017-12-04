#include <Kitchen.h>
#include <ArduinoJson.h>

bool Kitchen::anyAvailable(int timeToAdd) {
  int i=0;
  bool available=false;

  for(i;i<MAX_QUEQUES;i++){
    if((queques[i].timeConsumed+timeToAdd)<MAX_DELAY_TIME){
      available=true;
      i=MAX_QUEQUES;
    }
  }
  return available;
}

bool Kitchen::isAvailable (int numberQueque,int timeToAdd){
  if(numberQueque>=MAX_QUEQUES||numberQueque<0){
    return false;
  }
  if((queques[numberQueque].timeConsumed+timeToAdd)<MAX_DELAY_TIME){
    return true;
  }else{
    return false;
  }
}
int Kitchen::getTimeConsumed (int numberQueque){
  if(numberQueque>=MAX_QUEQUES||numberQueque<0){
    return -1;
  }
  int i=queques[numberQueque].timeConsumed;
  return i;
}
int Kitchen::getTimeHeader(int numberQueque){
  if(numberQueque>=MAX_QUEQUES||numberQueque<0){
    return -1;
  }
  int i=queques[numberQueque].headerTime;
  return i;
}
int Kitchen::getMinTimeFull(int numberQueque){
  if(numberQueque>=MAX_QUEQUES||numberQueque<0){
    return -1;
  }
  return (MAX_DELAY_TIME-queques[numberQueque].timeConsumed);
}

int Kitchen::getLessFullQueque(){
  int minTime=MAX_DELAY_TIME-1;
  int i=0;
  int numberBetterQueque=-1;
  for(i;i<MAX_QUEQUES;i++){
    int consumed=queques[i].timeConsumed;
    if(consumed<=minTime){
      minTime=consumed;
      numberBetterQueque=i;
    }
  }
  return numberBetterQueque;
}

int Kitchen::pushMenu(KitchenItem *item){
  int numberQueque=getLessFullQueque();
  int inserted = pushMenu(numberQueque,item);
  return inserted
}

int Kitchen::pushMenu(int numberQueque,KitchenItem *item){
  if(numberQueque>=MAX_QUEQUES||numberQueque<0){
    return -1;
  }
  if(isAvailable(numberQueque,item->elaborationTime)){
    if(queques[numberQueque].items.isEmpty()){
    queques[numberQueque].headerTime=item->elaborationTime;
    }
    item->idQueque=numberQueque;
    queques[numberQueque].items.push(*(item));
    queques[numberQueque].timeConsumed=queques[numberQueque].timeConsumed+item->elaborationTime;
    return numberQueque;
  }else{
    return numberQueque;
  }
}

Kitchen::Kitchen(void){
  for( int i = 0; i < MAX_QUEQUES; i = i + 1 ) {
  queques[i].timeConsumed = 0;
  queques[i].idQueque=i;
  }
  return;
}



int Kitchen::pushMenuRemoved(KitchenItem *item){
    quequeRemoved[0].items.push(*(item));
    return 1;
}


int Kitchen::tickTime(){
int i=0;
  for( int a = 0; a < MAX_QUEQUES; a = a + 1 ) {
    if(queques[a].items.isEmpty()==false){
      queques[a].headerTime=queques[a].headerTime-1;
      queques[a].timeConsumed=queques[a].timeConsumed-1;
      if(queques[a].headerTime==0){
        KitchenItem itemRemoved=queques[a].items.front();
        i=pushMenuRemoved(&itemRemoved);
        queques[a].items.pop();
      if(queques[a].items.isEmpty()==false){
          queques[a].headerTime=queques[a].items.front().elaborationTime;
        }
      }
    }
  }
  return i;
}

bool Kitchen::anyRemoved(){
  if(quequeRemoved[0].items.count()>0){
    return true;
  }else{
    return false;
  }
}

KitchenItem Kitchen::getRemoved(){
  return quequeRemoved[0].items.pop();
}
