function [prob, trans] = probdist(states, num_states)
    %probdist computes the probability distribution of the
    %states generated by classification(). It also computes
    %the transition probability between consecutive states
    %trans is (state at t) x (state at t+1)
    
    sum_states = zeros(1, num_states);
    trans = zeros(num_states, num_states);
    
    for i=1:num_states
       sum_states(i) = sum(states == i);
    end
    
    for j=1:length(states)
       if j > 1
          prevstate = states(j-1);
          currstate = states(j);
          trans(prevstate, currstate) = trans(prevstate, currstate) + 1;
       end 
    end
    
    prob = sum_states/length(states);
    trans = trans/(length(states)-1);

end

