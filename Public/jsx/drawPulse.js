function pulse () {
    var pulseObj = {
        updateVotePulse: displayVotes,
        updateChatPulse: displayChat,
        totalChat: 0,
        totalVotes: 0,
        chat: [0],
        votes: [0]
    }
    function displayVotes(id, width, height, updateDelay) {
		var graph = d3.select(id).append("svg:svg").attr("width", "100%").attr("height", "100%");
		
        var dataOne = [50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50];
		
		var x = d3.scale.linear().domain([0, 48]).range([-5, width]);
		var y = d3.scale.linear().domain([0, 100]).range([0, height]);
		var line = d3.svg.line()
			.x(function(d,i) { 
				return x(i); 
			})
			.y(function(d) { 
				return y(d); 
			})
			.interpolate("cardinal")
            
			graph.append("svg:path").attr("d", line(dataOne));
			
			function redrawWithAnimation() {
				graph.selectAll("path")
					.data([dataOne])
					.attr("transform", "translate(" + x(1) + ")")
					.attr("d", line)
					.transition()
					.ease('linear')
					.attr("transform", "translate(" + x(0) + ")");
			}
			
			setInterval(function() {
			    var i = pulseObj.votes.length-1;
			    var nextVar = 50;
			    if(pulseObj.totalVotes - pulseObj.votes[i] !== 0) {
			        nextVar = Math.floor((Math.random() * 90) + 1);
			        pulseObj.votes.push(pulseObj.totalVotes);
			    }
			    dataOne.shift();
			    dataOne.push(nextVar);
                redrawWithAnimation();
			}, updateDelay);
		}


	function displayChat(id, width, height, updateDelay) {
		var graph = d3.select(id).append("svg:svg").attr("width", "100%").attr("height", "100%");
        var dataTwo = [50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50];
		
		var x = d3.scale.linear().domain([0, 48]).range([-5, width]);
		var y = d3.scale.linear().domain([0, 100]).range([0, height]);
		var line = d3.svg.line()
			.x(function(d,i) { 
				return x(i); 
			})
			.y(function(d) { 
				return y(d); 
			})
			.interpolate("cardinal")
            
			graph.append("svg:path").attr("d", line(dataTwo));
			
			function redrawWithAnimation() {
				graph.selectAll("path")
					.data([dataTwo])
					.attr("transform", "translate(" + x(1) + ")")
					.attr("d", line)
					.transition()
					.ease("linear")
					.attr("transform", "translate(" + x(0) + ")");
			}
			
			setInterval(function() {
			    var i = pulseObj.chat.length-1;
			    var nextVar = 50;
			    if(pulseObj.totalChat - pulseObj.chat[i] !== 0) {
			        nextVar = Math.floor((Math.random() * 90) + 1);
			        pulseObj.chat.push(pulseObj.totalChat);
			    }
			    dataTwo.shift();
			    dataTwo.push(nextVar);
                redrawWithAnimation();
			}, updateDelay);
		}
		
		return pulseObj;
}
// Used idea http://codepen.io/mginnard/pen/mkBEg?editors=1000 to inspire this chat pulse.

module.exports = pulse;