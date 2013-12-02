(function(ctx, undefined){
    "use strict";

    var poller={
        /**
        *Creates a new poller.
        *def = {object}
        *
            {
                method:obj.say,         //initiator method, the method to poll
                context:obj,            //context to run initiator method
                asyncCallbackIndex:1,   //restart poll firs when the callback
                                        in the args array has executed.
                args:["hej", callback],             
                delay:2000              //set poll delay
            }
        **/
        createPoller:function(def){
        var poller ={
        context:(def.context || ctx),
            delay:def.delay || 1000,
            run:true,
            start:function(delay){
                if(this.run){
                    if(delay!==undefined){
                        this.delay=delay;
                        setTimeout(this.poll(this),0);
                    }
                    else{
                        setTimeout(this.poll(this),this.delay);
                    }
                }
                return this;
            },
            stop:function(){
                this.run=false;
                return this;
            },
            resume:function(){
                this.run=true;
            },
            poll:function(poller){
                    return function(){
                        return (function(context){
                            def.method.apply(context, def.args);   
                        })(poller.context);
                    }
                }
            };
            (function(poller){
                var m=(typeof def.callback)==='function')?
                 (function(){
                    var fn=def.callback;
                    return function(){
                        fn.apply(poller.context, arguments);
                        poller.start();
                    }
                })()
                :(function(){
                    var fn=def.method;
                    return function(){
                        fn.apply(poller.context, def.args);
                        poller.start();
                    }
                })();
                if(typeof def.callback==='function'){
                    def.callback=m;
                }
                else{
                    def.method=m;
                }
            })(poller)
        return poller;
        }
    }
        ctx.poller=poller;
})(this)
