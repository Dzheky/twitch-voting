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
    

    
    
    function updatePie(poll) {
        var arc = d3.arc().outerRadius(pieDim.w/2 - 10).innerRadius(0);
        var pie = d3.pie().value(function(d) {return d});
        var colors = d3.scaleOrdinal(d3.schemeCategory10)
        votes = poll.polls.map(function(data) {
            return data.peopleVoted;
        })
        votes.pop();
        console.log(votes);
        var pies = piesvg.selectAll("path").data(pie(votes));
        pies.enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", 'black');
        pies.attr('d', arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d, i) { return colors(i)});
    }
    return polls;
}

module.exports = drawPoll;