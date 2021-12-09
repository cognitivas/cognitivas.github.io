function Sim(){this.simTime=0,this.entities=[],this.queue=new Sim.PQueue,this.endTime=0,this.entityId=1}Sim.prototype.time=function(){return this.simTime},Sim.prototype.sendMessage=function(){var t=this.source,e=this.msg,i=this.data,s=t.sim;if(i)if(i instanceof Array)for(r=i.length-1;r>=0;r--)n=i[r],n!==t&&n.onMessage&&n.onMessage.call(n,t,e);else i.onMessage&&i.onMessage.call(i,t,e);else for(var r=s.entities.length-1;r>=0;r--){var n=s.entities[r];n!==t&&n.onMessage&&n.onMessage.call(n,t,e)}},Sim.prototype.addEntity=function(t){if(!t.start)throw Error("Entity prototype must have start() function defined");t.time||(t.time=function(){return this.sim.time()},t.setTimer=function(t){return t=new Sim.Request(this,this.sim.time(),this.sim.time()+t),this.sim.queue.insert(t),t},t.waitEvent=function(t){var e=new Sim.Request(this,this.sim.time(),0);return e.source=t,t.addWaitList(e),e},t.queueEvent=function(t){var e=new Sim.Request(this,this.sim.time(),0);return e.source=t,t.addQueue(e),e},t.useFacility=function(t,e){var i=new Sim.Request(this,this.sim.time(),0);return i.source=t,t.use(e,i),i},t.putBuffer=function(t,e){var i=new Sim.Request(this,this.sim.time(),0);return i.source=t,t.put(e,i),i},t.getBuffer=function(t,e){var i=new Sim.Request(this,this.sim.time(),0);return i.source=t,t.get(e,i),i},t.putStore=function(t,e){var i=new Sim.Request(this,this.sim.time(),0);return i.source=t,t.put(e,i),i},t.getStore=function(t,e){var i=new Sim.Request(this,this.sim.time(),0);return i.source=t,t.get(e,i),i},t.send=function(t,e,i){e=new Sim.Request(this.sim,this.time(),this.time()+e),e.source=this,e.msg=t,e.data=i,e.deliver=this.sim.sendMessage,this.sim.queue.insert(e)},t.log=function(t){this.sim.log(t,this)});var e=function(t){function e(){}if(null==t)throw TypeError();if(Object.create)return Object.create(t);var i=typeof t;if("object"!==i&&"function"!==i)throw TypeError();return e.prototype=t,new e}(t);if(e.sim=this,e.id=this.entityId++,this.entities.push(e),arguments.length>1){for(var i=[],s=1;s<arguments.length;s++)i.push(arguments[s]);e.start.apply(e,i)}else e.start();return e},Sim.prototype.simulate=function(t,e){e||(e=Math.Infinity);for(var i=0;;){if(i++,i>e)return!1;var s=this.queue.remove();if(void 0==s)break;if(s.deliverAt>t)break;this.simTime=s.deliverAt,s.cancelled||s.deliver()}return this.finalize(),!0},Sim.prototype.step=function(){for(;;){var t=this.queue.remove();if(!t)return!1;if(this.simTime=t.deliverAt,!t.cancelled){t.deliver();break}}return!0},Sim.prototype.finalize=function(){for(var t=0;t<this.entities.length;t++)this.entities[t].finalize&&this.entities[t].finalize()},Sim.prototype.setLogger=function(t){this.logger=t},Sim.prototype.log=function(t,e){if(this.logger){var i="";void 0!==e&&(i=e.name?" ["+e.name+"]":" ["+e.id+"] "),this.logger(this.simTime.toFixed(6)+i+"   "+t)}},Sim.Facility=function(t,e,i,s){switch(this.free=i?i:1,this.servers=i?i:1,this.maxqlen=void 0===s?-1:1*s,e){case Sim.Facility.LCFS:this.use=this.useLCFS,this.queue=new Sim.Queue;break;case Sim.Facility.PS:this.use=this.useProcessorSharing,this.queue=[];break;default:for(this.use=this.useFCFS,this.freeServers=Array(this.servers),this.queue=new Sim.Queue,t=0;t<this.freeServers.length;t++)this.freeServers[t]=!0}this.stats=new Sim.Population,this.busyDuration=0},Sim.Facility.FCFS=1,Sim.Facility.LCFS=2,Sim.Facility.PS=3,Sim.Facility.NumDisciplines=4,Sim.Facility.prototype.reset=function(){this.queue.reset(),this.stats.reset(),this.busyDuration=0},Sim.Facility.prototype.systemStats=function(){return this.stats},Sim.Facility.prototype.queueStats=function(){return this.queue.stats},Sim.Facility.prototype.usage=function(){return this.busyDuration},Sim.Facility.prototype.finalize=function(t){this.stats.finalize(t),this.queue.stats.finalize(t)},Sim.Facility.prototype.useFCFS=function(t,e){if(0===this.maxqlen&&!this.free||this.maxqlen>0&&this.queue.size()>=this.maxqlen)e.msg=-1,e.deliverAt=e.entity.time(),e.entity.sim.queue.insert(e);else{e.duration=t;var i=e.entity.time();this.stats.enter(i),this.queue.push(e,i),this.useFCFSSchedule(i)}},Sim.Facility.prototype.useFCFSSchedule=function(t){for(;this.free>0&&!this.queue.empty();){var e=this.queue.shift(t);if(!e.cancelled){for(var i=0;i<this.freeServers.length;i++)if(this.freeServers[i]){this.freeServers[i]=!1,e.msg=i;break}this.free--,this.busyDuration+=e.duration,e.cancelRenegeClauses(),i=new Sim.Request(this,t,t+e.duration),i.done(this.useFCFSCallback,this,e),e.entity.sim.queue.insert(i)}}},Sim.Facility.prototype.useFCFSCallback=function(t){this.free++,this.freeServers[t.msg]=!0,this.stats.leave(t.scheduledAt,t.entity.time()),this.useFCFSSchedule(t.entity.time()),t.deliver()},Sim.Facility.prototype.useLCFS=function(t,e){this.currentRO&&(this.busyDuration+=this.currentRO.entity.time()-this.currentRO.lastIssued,this.currentRO.remaining=this.currentRO.deliverAt-this.currentRO.entity.time(),this.queue.push(this.currentRO,e.entity.time())),this.currentRO=e,e.saved_deliver||(e.cancelRenegeClauses(),e.remaining=t,e.saved_deliver=e.deliver,e.deliver=this.useLCFSCallback,this.stats.enter(e.entity.time())),e.lastIssued=e.entity.time(),e.deliverAt=e.entity.time()+t,e.entity.sim.queue.insert(e)},Sim.Facility.prototype.useLCFSCallback=function(){var t=this.source;if(this==t.currentRO&&(t.currentRO=null,t.busyDuration+=this.entity.time()-this.lastIssued,t.stats.leave(this.scheduledAt,this.entity.time()),this.deliver=this.saved_deliver,delete this.saved_deliver,this.deliver(),!t.queue.empty())){var e=t.queue.pop(this.entity.time());t.useLCFS(e.remaining,e)}},Sim.Facility.prototype.useProcessorSharing=function(t,e){e.duration=t,e.cancelRenegeClauses(),this.stats.enter(e.entity.time()),this.useProcessorSharingSchedule(e,!0)},Sim.Facility.prototype.useProcessorSharingSchedule=function(t,e){var i=t.entity.time(),s=this.queue.length,r=e?(s+1)/s:(s-1)/s,n=[];0===this.queue.length&&(this.lastIssued=i);for(var u=0;s>u;u++){var o=this.queue[u];if(o.ro!==t){var a=new Sim.Request(this,i,i+(o.deliverAt-i)*r);a.ro=o.ro,a.source=this,a.deliver=this.useProcessorSharingCallback,n.push(a),o.cancel(),t.entity.sim.queue.insert(a)}}e&&(a=new Sim.Request(this,i,i+t.duration*(s+1)),a.ro=t,a.source=this,a.deliver=this.useProcessorSharingCallback,n.push(a),t.entity.sim.queue.insert(a)),this.queue=n,0==this.queue.length&&(this.busyDuration+=i-this.lastIssued)},Sim.Facility.prototype.useProcessorSharingCallback=function(){var t=this.source;this.cancelled||(t.stats.leave(this.ro.scheduledAt,this.ro.entity.time()),t.useProcessorSharingSchedule(this.ro,!1),this.ro.deliver())},Sim.Buffer=function(t,e,i){this.name=t,this.capacity=e,this.available=void 0===i?0:i,this.putQueue=new Sim.Queue,this.getQueue=new Sim.Queue},Sim.Buffer.prototype.current=function(){return this.available},Sim.Buffer.prototype.size=function(){return this.capacity},Sim.Buffer.prototype.get=function(t,e){this.getQueue.empty()&&t<=this.available?(this.available-=t,e.deliverAt=e.entity.time(),e.entity.sim.queue.insert(e),this.getQueue.passby(e.deliverAt),this.progressPutQueue()):(e.amount=t,this.getQueue.push(e,e.entity.time()))},Sim.Buffer.prototype.put=function(t,e){this.putQueue.empty()&&t+this.available<=this.capacity?(this.available+=t,e.deliverAt=e.entity.time(),e.entity.sim.queue.insert(e),this.putQueue.passby(e.deliverAt),this.progressGetQueue()):(e.amount=t,this.putQueue.push(e,e.entity.time()))},Sim.Buffer.prototype.progressGetQueue=function(){for(var t;t=this.getQueue.top();)if(t.cancelled)this.getQueue.shift(t.entity.time());else{if(!(t.amount<=this.available))break;this.getQueue.shift(t.entity.time()),this.available-=t.amount,t.deliverAt=t.entity.time(),t.entity.sim.queue.insert(t)}},Sim.Buffer.prototype.progressPutQueue=function(){for(var t;t=this.putQueue.top();)if(t.cancelled)this.putQueue.shift(t.entity.time());else{if(!(t.amount+this.available<=this.capacity))break;this.putQueue.shift(t.entity.time()),this.available+=t.amount,t.deliverAt=t.entity.time(),t.entity.sim.queue.insert(t)}},Sim.Buffer.prototype.putStats=function(){return this.putQueue.stats},Sim.Buffer.prototype.getStats=function(){return this.getQueue.stats},Sim.Store=function(t,e){this.name=t,this.capacity=e,this.objects=[],this.putQueue=new Sim.Queue,this.getQueue=new Sim.Queue},Sim.Store.prototype.current=function(){return this.objects.length},Sim.Store.prototype.size=function(){return this.capacity},Sim.Store.prototype.get=function(t,e){if(this.getQueue.empty()&&this.current()>0){var i,s=!1;if(t){for(var r=0;r<this.objects.length;r++)if(i=this.objects[r],t(i)){s=!0,this.objects.splice(r,1);break}}else i=this.objects.shift(),s=!0;if(s)return this.available--,e.msg=i,e.deliverAt=e.entity.time(),e.entity.sim.queue.insert(e),this.getQueue.passby(e.deliverAt),void this.progressPutQueue()}e.filter=t,this.getQueue.push(e,e.entity.time())},Sim.Store.prototype.put=function(t,e){this.putQueue.empty()&&this.current()<this.capacity?(this.available++,e.deliverAt=e.entity.time(),e.entity.sim.queue.insert(e),this.putQueue.passby(e.deliverAt),this.objects.push(t),this.progressGetQueue()):(e.obj=t,this.putQueue.push(e,e.entity.time()))},Sim.Store.prototype.progressGetQueue=function(){for(var t;t=this.getQueue.top();)if(t.cancelled)this.getQueue.shift(t.entity.time());else{if(!(this.current()>0))break;var e,i=t.filter,s=!1;if(i){for(var r=0;r<this.objects.length;r++)if(e=this.objects[r],i(e)){s=!0,this.objects.splice(r,1);break}}else e=this.objects.shift(),s=!0;if(!s)break;this.getQueue.shift(t.entity.time()),this.available--,t.msg=e,t.deliverAt=t.entity.time(),t.entity.sim.queue.insert(t)}},Sim.Store.prototype.progressPutQueue=function(){for(var t;t=this.putQueue.top();)if(t.cancelled)this.putQueue.shift(t.entity.time());else{if(!(this.current()<this.capacity))break;this.putQueue.shift(t.entity.time()),this.available++,this.objects.push(t.obj),t.deliverAt=t.entity.time(),t.entity.sim.queue.insert(t)}},Sim.Store.prototype.putStats=function(){return this.putQueue.stats},Sim.Store.prototype.getStats=function(){return this.getQueue.stats},Sim.Event=function(t){this.name=t,this.waitList=[],this.queue=[],this.isFired=!1},Sim.Event.prototype.addWaitList=function(t){this.isFired?(t.deliverAt=t.entity.time(),t.entity.sim.queue.insert(t)):this.waitList.push(t)},Sim.Event.prototype.addQueue=function(t){this.isFired?(t.deliverAt=t.entity.time(),t.entity.sim.queue.insert(t)):this.queue.push(t)},Sim.Event.prototype.fire=function(t){t&&(this.isFired=!0),t=this.waitList,this.waitList=[];for(var e=0;e<t.length;e++)t[e].deliver();(t=this.queue.shift())&&t.deliver()},Sim.Event.prototype.clear=function(){this.isFired=!1},Sim.Request=function(t,e,i){this.entity=t,this.scheduledAt=e,this.deliverAt=i,this.callbacks=[],this.cancelled=!1,this.group=null},Sim.Request.prototype.cancel=function(){if(this.group&&this.group[0]!=this)return this.group[0].cancel();if(this.noRenege)return this;if(!this.cancelled&&(this.cancelled=!0,0==this.deliverAt&&(this.deliverAt=this.entity.time()),this.source&&(this.source instanceof Sim.Buffer||this.source instanceof Sim.Store)&&(this.source.progressPutQueue.call(this.source),this.source.progressGetQueue.call(this.source)),this.group))for(var t=1;t<this.group.length;t++)this.group[t].cancelled=!0,0==this.group[t].deliverAt&&(this.group[t].deliverAt=this.entity.time())},Sim.Request.prototype.done=function(t,e,i){return this.callbacks.push([t,e,i]),this},Sim.Request.prototype.waitUntil=function(t,e,i,s){return this.noRenege?this:(this.entity.sim.queue.insert(this._addRequest(this.scheduledAt+t,e,i,s)),this)},Sim.Request.prototype.unlessEvent=function(t,e,i,s){if(this.noRenege)return this;if(t instanceof Sim.Event){var r=this._addRequest(0,e,i,s);r.msg=t,t.addWaitList(r)}else if(t instanceof Array)for(var n=0;n<t.length;n++)r=this._addRequest(0,e,i,s),r.msg=t[n],t[n].addWaitList(r);return this},Sim.Request.prototype.setData=function(t){return this.data=t,this},Sim.Request.prototype.deliver=function(){this.cancelled||(this.cancel(),this.callbacks&&(this.group&&this.group.length>0?this._doCallback(this.group[0].source,this.msg,this.group[0].data):this._doCallback(this.source,this.msg,this.data)))},Sim.Request.prototype.cancelRenegeClauses=function(){if(this.noRenege=!0,this.group&&this.group[0]==this)for(var t=1;t<this.group.length;t++)this.group[t].cancelled=!0,0==this.group[t].deliverAt&&(this.group[t].deliverAt=this.entity.time())},Sim.Request.prototype.Null=function(){return this},Sim.Request.prototype._addRequest=function(t,e,i,s){return t=new Sim.Request(this.entity,this.scheduledAt,t),t.callbacks.push([e,i,s]),null===this.group&&(this.group=[this]),this.group.push(t),t.group=this.group,t},Sim.Request.prototype._doCallback=function(t,e,i){for(var s=0;s<this.callbacks.length;s++){var r=this.callbacks[s][0];if(r){var n=this.callbacks[s][1];n||(n=this.entity);var u=this.callbacks[s][2];n.callbackSource=t,n.callbackMessage=e,n.callbackData=i,u?u instanceof Array?r.apply(n,u):r.call(n,u):r.call(n),n.callbackSource=null,n.callbackMessage=null,n.callbackData=null}}},Sim.Queue=function(t){this.name=t,this.data=[],this.timestamp=[],this.stats=new Sim.Population},Sim.Queue.prototype.top=function(){return this.data[0]},Sim.Queue.prototype.back=function(){return this.data.length?this.data[this.data.length-1]:void 0},Sim.Queue.prototype.push=function(t,e){this.data.push(t),this.timestamp.push(e),this.stats.enter(e)},Sim.Queue.prototype.unshift=function(t,e){this.data.unshift(t),this.timestamp.unshift(e),this.stats.enter(e)},Sim.Queue.prototype.shift=function(t){var e=this.data.shift();return this.stats.leave(this.timestamp.shift(),t),e},Sim.Queue.prototype.pop=function(t){var e=this.data.pop();return this.stats.leave(this.timestamp.pop(),t),e},Sim.Queue.prototype.passby=function(t){this.stats.enter(t),this.stats.leave(t,t)},Sim.Queue.prototype.finalize=function(t){this.stats.finalize(t)},Sim.Queue.prototype.reset=function(){this.stats.reset()},Sim.Queue.prototype.clear=function(){this.reset(),this.data=[],this.timestamp=[]},Sim.Queue.prototype.report=function(){return[this.stats.sizeSeries.average(),this.stats.durationSeries.average()]},Sim.Queue.prototype.empty=function(){return 0==this.data.length},Sim.Queue.prototype.size=function(){return this.data.length},Sim.PQueue=function(){this.data=[],this.order=0},Sim.PQueue.prototype.greater=function(t,e){return t.deliverAt>e.deliverAt?!0:t.deliverAt==e.deliverAt?t.order>e.order:!1},Sim.PQueue.prototype.insert=function(t){t.order=this.order++;var e=this.data.length;this.data.push(t);for(var i=this.data,s=i[e];e>0;){var r=Math.floor((e-1)/2);if(!this.greater(i[r],t))break;i[e]=i[r],e=r}i[e]=s},Sim.PQueue.prototype.remove=function(){var t=this.data,e=t.length;if(!(0>=e)){if(1==e)return this.data.pop();var i=t[0];t[0]=t.pop(),e--;for(var s=0,r=t[s];s<Math.floor(e/2);){var n=2*s+1,u=2*s+2,n=e>u&&!this.greater(t[u],t[n])?u:n;if(this.greater(t[n],r))break;t[s]=t[n],s=n}return t[s]=r,i}},Sim.DataSeries=function(t){this.name=t,this.reset()},Sim.DataSeries.prototype.reset=function(){if(this.Q=this.A=this.W=this.Count=0,this.Max=-(1/0),this.Min=1/0,this.Sum=0,this.histogram)for(var t=0;t<this.histogram.length;t++)this.histogram[t]=0},Sim.DataSeries.prototype.setHistogram=function(t,e,i){for(this.hLower=t,this.hUpper=e,this.hBucketSize=(e-t)/i,this.histogram=Array(i+2),t=0;t<this.histogram.length;t++)this.histogram[t]=0},Sim.DataSeries.prototype.getHistogram=function(){return this.histogram},Sim.DataSeries.prototype.record=function(t,e){var i=void 0===e?1:e;if(t>this.Max&&(this.Max=t),t<this.Min&&(this.Min=t),this.Sum+=t,this.Count++,this.histogram&&(t<this.hLower?this.histogram[0]+=i:t>this.hUpper?this.histogram[this.histogram.length-1]+=i:this.histogram[Math.floor((t-this.hLower)/this.hBucketSize)+1]+=i),this.W+=i,0!==this.W){var s=this.A;this.A=s+i/this.W*(t-s),this.Q+=i*(t-s)*(t-this.A)}},Sim.DataSeries.prototype.count=function(){return this.Count},Sim.DataSeries.prototype.min=function(){return this.Min},Sim.DataSeries.prototype.max=function(){return this.Max},Sim.DataSeries.prototype.range=function(){return this.Max-this.Min},Sim.DataSeries.prototype.sum=function(){return this.Sum},Sim.DataSeries.prototype.sumWeighted=function(){return this.A*this.W},Sim.DataSeries.prototype.average=function(){return this.A},Sim.DataSeries.prototype.variance=function(){return this.Q/this.W},Sim.DataSeries.prototype.deviation=function(){return Math.sqrt(this.variance())},Sim.TimeSeries=function(t){this.dataSeries=new Sim.DataSeries(t)},Sim.TimeSeries.prototype.reset=function(){this.dataSeries.reset(),this.lastTimestamp=this.lastValue=NaN},Sim.TimeSeries.prototype.setHistogram=function(t,e,i){this.dataSeries.setHistogram(t,e,i)},Sim.TimeSeries.prototype.getHistogram=function(){return this.dataSeries.getHistogram()},Sim.TimeSeries.prototype.record=function(t,e){isNaN(this.lastTimestamp)||this.dataSeries.record(this.lastValue,e-this.lastTimestamp),this.lastValue=t,this.lastTimestamp=e},Sim.TimeSeries.prototype.finalize=function(t){this.record(NaN,t)},Sim.TimeSeries.prototype.count=function(){return this.dataSeries.count()},Sim.TimeSeries.prototype.min=function(){return this.dataSeries.min()},Sim.TimeSeries.prototype.max=function(){return this.dataSeries.max()},Sim.TimeSeries.prototype.range=function(){return this.dataSeries.range()},Sim.TimeSeries.prototype.sum=function(){return this.dataSeries.sum()},Sim.TimeSeries.prototype.average=function(){return this.dataSeries.average()},Sim.TimeSeries.prototype.deviation=function(){return this.dataSeries.deviation()},Sim.TimeSeries.prototype.variance=function(){return this.dataSeries.variance()},Sim.Population=function(t){this.name=t,this.population=0,this.sizeSeries=new Sim.TimeSeries,this.durationSeries=new Sim.DataSeries},Sim.Population.prototype.reset=function(){this.sizeSeries.reset(),this.durationSeries.reset(),this.population=0},Sim.Population.prototype.enter=function(t){this.population++,this.sizeSeries.record(this.population,t)},Sim.Population.prototype.leave=function(t,e){this.population--,this.sizeSeries.record(this.population,e),this.durationSeries.record(e-t)},Sim.Population.prototype.current=function(){return this.population},Sim.Population.prototype.finalize=function(t){this.sizeSeries.finalize(t)};var Random=function(t){t=void 0===t?(new Date).getTime():t,this.N=624,this.M=397,this.MATRIX_A=2567483615,this.UPPER_MASK=2147483648,this.LOWER_MASK=2147483647,this.mt=Array(this.N),this.mti=this.N+1,this.init_by_array([t],1)};Random.prototype.init_genrand=function(t){for(this.mt[0]=t>>>0,this.mti=1;this.mti<this.N;this.mti++)t=this.mt[this.mti-1]^this.mt[this.mti-1]>>>30,this.mt[this.mti]=(1812433253*((4294901760&t)>>>16)<<16)+1812433253*(65535&t)+this.mti,this.mt[this.mti]>>>=0},Random.prototype.init_by_array=function(t,e){var i,s,r;for(this.init_genrand(19650218),i=1,s=0,r=this.N>e?this.N:e;r;r--){var n=this.mt[i-1]^this.mt[i-1]>>>30;this.mt[i]=(this.mt[i]^(1664525*((4294901760&n)>>>16)<<16)+1664525*(65535&n))+t[s]+s,this.mt[i]>>>=0,i++,s++,i>=this.N&&(this.mt[0]=this.mt[this.N-1],i=1),s>=e&&(s=0)}for(r=this.N-1;r;r--)n=this.mt[i-1]^this.mt[i-1]>>>30,this.mt[i]=(this.mt[i]^(1566083941*((4294901760&n)>>>16)<<16)+1566083941*(65535&n))-i,this.mt[i]>>>=0,i++,i>=this.N&&(this.mt[0]=this.mt[this.N-1],i=1);this.mt[0]=2147483648},Random.prototype.genrand_int32=function(){var t,e=[0,this.MATRIX_A];if(this.mti>=this.N){var i;for(this.mti==this.N+1&&this.init_genrand(5489),i=0;i<this.N-this.M;i++)t=this.mt[i]&this.UPPER_MASK|this.mt[i+1]&this.LOWER_MASK,this.mt[i]=this.mt[i+this.M]^t>>>1^e[1&t];for(;i<this.N-1;i++)t=this.mt[i]&this.UPPER_MASK|this.mt[i+1]&this.LOWER_MASK,this.mt[i]=this.mt[i+(this.M-this.N)]^t>>>1^e[1&t];t=this.mt[this.N-1]&this.UPPER_MASK|this.mt[0]&this.LOWER_MASK,this.mt[this.N-1]=this.mt[this.M-1]^t>>>1^e[1&t],this.mti=0}return t=this.mt[this.mti++],t^=t>>>11,t^=t<<7&2636928640,t^=t<<15&4022730752,t^=t>>>18,t>>>0},Random.prototype.genrand_int31=function(){return this.genrand_int32()>>>1},Random.prototype.genrand_real1=function(){return this.genrand_int32()*(1/4294967295)},Random.prototype.random=function(){return this.pythonCompatibility&&(this.skip&&this.genrand_int32(),this.skip=!0),this.genrand_int32()*(1/4294967296)},Random.prototype.genrand_real3=function(){return(this.genrand_int32()+.5)*(1/4294967296)},Random.prototype.genrand_res53=function(){var t=this.genrand_int32()>>>5,e=this.genrand_int32()>>>6;return 1.1102230246251565e-16*(67108864*t+e)},Random.prototype.LOG4=Math.log(4),Random.prototype.SG_MAGICCONST=1+Math.log(4.5),Random.prototype.exponential=function(t){var e=this.random();return-Math.log(e)/t},Random.prototype.gamma=function(t,e){if(!(t>1)){if(1==t){for(var i=this.random();1e-7>=i;)i=this.random();return-Math.log(i)*e}for(;;)if(i=this.random(),h=(Math.E+t)/Math.E,i*=h,h=1>=i?Math.pow(i,1/t):-Math.log((h-i)/t),u=this.random(),i>1){if(u<=Math.pow(h,t-1))break}else if(u<=Math.exp(-h))break;return h*e}for(var s=Math.sqrt(2*t-1),r=t-this.LOG4,n=t+s;;){var u=this.random();if(!(1e-7>u||i>.9999999)){var o=1-this.random(),a=Math.log(u/(1-u))/s,h=t*Math.exp(a),u=u*u*o,a=r+n*a-h;if(a+this.SG_MAGICCONST-4.5*u>=0||a>=Math.log(u))return h*e}}},Random.prototype.normal=function(t,e){var i=this.lastNormal;if(this.lastNormal=NaN,!i){var s=2*this.random()*Math.PI,r=Math.sqrt(-2*Math.log(1-this.random())),i=Math.cos(s)*r;this.lastNormal=Math.sin(s)*r}return t+i*e},Random.prototype.pareto=function(t){var e=this.random();return 1/Math.pow(1-e,1/t)},Random.prototype.triangular=function(t,e,i){var s=(i-t)/(e-t),r=this.random();return s>=r?t+Math.sqrt(r*(e-t)*(i-t)):e-Math.sqrt((1-r)*(e-t)*(e-i))},Random.prototype.uniform=function(t,e){return t+this.random()*(e-t)},Random.prototype.weibull=function(t,e){var i=1-this.random();return t*Math.pow(-Math.log(i),1/e)};