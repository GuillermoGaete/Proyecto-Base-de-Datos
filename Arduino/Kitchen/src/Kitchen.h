
#include <QueueArray.h>

#define MAX_QUEQUES 5
#define MAX_DELAY_TIME 60

struct KitchenItem {
   int idOrder;
   int elaborationTime;
   int idMenu;
   int idQueque;
};
struct QuequeKitchen{
  QueueArray <KitchenItem> items;
  int headerTime;
  int timeConsumed;
  int idQueque;
};

class Kitchen
{
  public:
    Kitchen(void);
    bool anyAvailable(int timeToAdd);
    bool isAvailable (int numberQueque, int timeToAdd);
    int getTimeConsumed (int numberQueque);
    int getTimeHeader (int numberQueque);
    int getMinTimeFull(int numberQueque);
    int getLessFullQueque();
    int pushMenu(int numberQueque,KitchenItem *item);
    int pushMenu(KitchenItem *item);
    int tickTime();
    bool anyRemoved();
    KitchenItem getRemoved();
    int pushMenuRemoved(KitchenItem *item);
  private:
    QuequeKitchen queques[MAX_QUEQUES];
    QuequeKitchen quequeRemoved[1];
};
