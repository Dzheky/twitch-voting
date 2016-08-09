function drawPoll(poll) {
    console.log('drawing a poll');
    var polls = {
        updatePie: updatePie
    }
    var pieDim ={w:250, h: 250};
    var votes = [];
    console.log(votes);
    var piesvg = d3.select('#pie').append('svg')
        .attr('height', '400')
        .attr('width', '400')
        .append('g')
        .attr('transform', 'translate('+pieDim.w/2+','+pieDim.h/2+')');
    var arc = d3.arc().outerRadius(pieDim.w/2 - 10).innerRadius(0);
    var pie = d3.pie().value(function(d) {return d});
    var colors = d3.scaleOrdinal(d3.schemeCategory10)
    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }
    
    
    function updatePie(poll) {
        votes = poll.polls.map(function(data) {
            return data.peopleVoted;
        })
        console.log(votes);
        var pies = piesvg.selectAll("path").data(pie(votes));
        pies.enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d, i) { return colors(i)});
            
        pies.transition().duration(750).attrTween('d', arcTween)
    }
    return polls;
}

module.exports = drawPoll;