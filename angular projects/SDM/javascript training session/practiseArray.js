      
   var res ;
   setTimeout(()=>{
          console.log("entering the time interval loop")  ;
            res = true; 
            var practicePromise = new Promise(function(resolve, reject){
                // var res = true;
                if(res){
                let x = "resolved state"
                    resolve(x); 
                }
                else{
                    let x = "rejected state";
                    reject(x);
                }
            })
            practicePromise.then( function(resolvedParam){
                resolvedParam = resolvedParam + ' executed'
                console.log(resolvedParam);
            })
            .catch( function(rejectedParam){
                rejectedParam = rejectedParam +' executed'
                console.log(rejectedParam)
            })
    
     
      },10000);
    //   console.log("welcome team", res);
      
     
    //   var practicePromise = new Promise(function(resolve, reject){
    //         // var res = true;
    //         if(res){
    //         let x = "resolved state"
    //             resolve(x); 
    //         }
    //         else{
    //             let x = "rejected state";
    //             reject(x);
    //         }
    //     })
    //     practicePromise.then( function(resolvedParam){
    //         resolvedParam = resolvedParam + ' executed'
    //         console.log(resolvedParam);
    //     })
    //     .catch( function(rejectedParam){
    //         rejectedParam = rejectedParam +' executed'
    //         console.log(rejectedParam)
    //     })

   