

function ksjdnfdsnfsd() {
  // something like
  
  let aa = new AnimatorBoxyBox();
  aa.and({
    when:()=>{
      if(v > 8323){
        requesty (update)
      }
    },
    update:()=>{
      springs()
    }
  });
  
  aa.then({
    when:()=>{
      if(v > 8323){
        requesty (update)
      }
    },
    update:()=>{
      wobble mode()
    }
  })
  
}



function sjndjdnfvfdnj() {
  // or roughly
  updafe(){
    slot a,
    slot b
    if(v > n){
      requestAnimationFrame(update)
    }
  }
  
  
  
  
}



export class AnimatorBoxyBox{
  
  index = 0;
  queues = [];
  
  constructor(){
    // setup a first queue
    let v = new Queue();
    this.queues[this.index].push(v);
  }
  
  and(func){
    this.queues[this.index].add(func);
  }
  
  addNext(func){
    
  }
  
}




class Queue{
  type = "?";
  queue = [];
  index = -1;
  _start = function() {};
  _exit = function() {};
  
  add(func){
    queue.push(func);
  }
  start(func){
    this._start = func;
  }
  exit(func){
    this._exit = func;
  }
}
