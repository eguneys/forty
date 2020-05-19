export function SoliFxDealDeck(solitaire) {
  
  let sData = solitaire.data;

  let data = this.data = {
  };

  this.doBegin = (stackN, isHidden) => {
    data.stackN = stackN;
    data.isHidden = isHidden;

    data.cards = [sData.drawStack.draw1()];
  };

  this.doEnd = () => {
    let stack = sData.stacks[data.stackN];
    if (data.isHidden) {
      stack.hide1(data.cards);
    } else {
      stack.add1(data.cards);
    }
  };

}
