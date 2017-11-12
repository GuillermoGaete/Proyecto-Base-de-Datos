#include <Kitchen.h>
#include <DueTimer.h>
#include <ArduinoJson.h>
#define GET_TIME 1
#define INSERT_ORDER 2
Kitchen kit;
int counter=0;
int ledOn=1;
int localCounter=1;
int inter=0;

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.begin(9600);
  while (!Serial) {
    // wait serial port initialization
  }
  Timer1.attachInterrupt(handlerTick).setFrequency(1).start();
  KitchenItem item={55,5,22,0};
  bool inserted=kit.pushMenu(0,&item);
  item={43,6,22,0};
  inserted=kit.pushMenu(1,&item);
}



void processAction(String recived){
  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& jsonRecived = jsonBuffer.parseObject(recived);
  int action=jsonRecived["action"];
  ack(jsonRecived["idMsg"]);
  switch (action) {
    case GET_TIME:
    sendInfo(jsonRecived["queque"]);
    break;
    case INSERT_ORDER:
    {
    int insertResult=insertOrder(jsonRecived["idOrder"],jsonRecived["elTime"]);
    sendInserted(jsonRecived["idOrder"],insertResult);
    }
    break;
  }
}
int insertOrder(int order,int elTime){
  KitchenItem item={order,elTime,22,0};
  int queque=kit.getLessFullQueque();
  int inserted=kit.pushMenu(queque,&item);  
  return inserted;
}




void loop() {  
  if(Serial.available() > 0){
      String recived = Serial.readStringUntil('}');
      recived=String(recived+'}');
      processAction(recived);    
  }  
  bool insert=0;
  if(counter==localCounter){    
    bool anyToRemove=kit.anyRemoved();
    if(anyToRemove){
       KitchenItem Removed=kit.getRemoved();
       sendRemoved(Removed.idQueque,Removed.idOrder);
     }
    localCounter++;
    }
}



void echo(String recived){
  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& senderEcho = jsonBuffer.parseObject("{}");
  senderEcho["info"]="echo";
  senderEcho["string"]=recived;
  if(Serial.availableForWrite()>0){
    senderEcho.printTo(Serial);  
    return;
  }else{
    echo(recived);
    return;
  }
}

void sendInserted(int order,int insertResult){
  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& senderJsonInserted = jsonBuffer.parseObject("{}");
  senderJsonInserted["action"]="order_inserted";
  if(insertResult>0){
     senderJsonInserted["state"]="inserted";
     senderJsonInserted["queque"]=insertResult;
  }else{
     senderJsonInserted["state"]="fail";
     senderJsonInserted["reason"]=insertResult;
  }
  senderJsonInserted["order"]=order;  
  if(Serial.availableForWrite()>0){
    senderJsonInserted.printTo(Serial);  
    return;
  }else{
    sendInserted(order,insertResult);
    return;
  } 
}



void ack(int id){
  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& senderEcho = jsonBuffer.parseObject("{}");
  senderEcho["info"]="ack";
  senderEcho["id"]=id;
  if(Serial.availableForWrite()>0){
    senderEcho.printTo(Serial);  
    return;
  }else{
    ack(id);
    return;
  }
}


void sendInfo(int queque){
  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& senderJsonInfo = jsonBuffer.parseObject("{}");
  senderJsonInfo["info"]="times";
  senderJsonInfo["queque"]=queque;
  senderJsonInfo["timeHeader"]=kit.getTimeHeader(queque);
  senderJsonInfo["timeConsumed"]=kit.getTimeConsumed(queque);
  if(Serial.availableForWrite()>0){
    senderJsonInfo.printTo(Serial);  
    return;
  }else{
    sendInfo(queque);
    return;
  }
}
void sendRemoved(int queque, int order){
  StaticJsonBuffer<512> jsonBuffer;
  JsonObject& senderJsonRemove = jsonBuffer.parseObject("{}");
  senderJsonRemove["action"]="finish_order";
  senderJsonRemove["queque"]=queque;
  senderJsonRemove["order"]=order;
  if(Serial.availableForWrite()>0){
    senderJsonRemove.printTo(Serial);  
    return;
  }else{
    sendRemoved(queque,order);
    return;
  } 
}

void handlerTick(){
    ledOn=!ledOn;
    digitalWrite(LED_BUILTIN, ledOn);   // turn the LED on (HIGH is the voltage level)
    counter++;
    kit.tickTime();
}

