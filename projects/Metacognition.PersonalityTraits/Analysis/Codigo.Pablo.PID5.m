clear
clc
% close all
direc = '/home/pablo/Documentos/trabajo/proyectos/010-personality-confidence/lee_pid_matlab';
addpath(genpath(fullfile(direc,'jsonlab-2.0')))

cd(direc)
Responses = [];
% json2data1=loadjson('pablo1_jatos_results_20201022004543.txt');
% json2data2=loadjson('pablo2_jatos_results_20201022004543.txt');

json2data1=loadjson('barby1_jatos_results_20201022142941.txt');
json2data2=loadjson('barby2_jatos_results_20201022142941.txt');

cont = 0;
for i = 1:size(json2data1,2)
    cont = cont + 1;
    Responses(cont) = str2double(json2data1{i}.value) - 1; 
end

for i = 1:size(json2data2,2)
    cont = cont + 1;
    Responses(cont) = str2double(json2data2{i}.value) - 1; 
end

%% Step 1: Reverse the scores on the following items (i.e., 3 becomes 0, 2 becomes 1, 1 becomes 2, and 0 becomes 3): 
% 7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, and 215.

inds2revert = [7, 30, 35, 58, 87, 90, 96, 97, 98, 131, 142, 155, 164, 177, 210, 215];
Responses(inds2revert) = abs(Responses(inds2revert) -3);

%% Step 2: Compute the Personality Trait Facet Scores using the Facet Table below.
% get the indices
indsAnhedonia                       = [1, 23, 26, 30, 124, 155, 157, 189];
indsAnxiousness                     = [79, 93, 95, 96, 109, 110, 130, 141, 174];
indsAttentionSeeking                = [14, 43, 74, 111, 113, 173, 191,211];
indsCallousness                     = [11, 13, 19, 54, 72, 73, 90, 153, 166, 183, 198, 200, 207, 208];
indsDeceitfulness                   = [41, 53, 56, 76, 126, 134, 142, 206, 214, 218];
indsDepressivity                    = [27, 61, 66, 81, 86, 104, 119, 148, 151, 163, 168, 169, 178, 212];
indsDistractivility                 = [6, 29, 47, 68, 88, 118, 132, 144, 199];
indsExcentricity                    = [5, 21, 24, 25, 33, 52, 55, 70, 71, 152, 172,185, 205];
indsEmotionalLability               = [18, 62, 102, 122, 138, 165, 181];
indsGrandiosity                     = [40, 65, 114, 179, 187, 197];
indsHostility                       = [28, 32, 38, 85, 92, 116, 158, 170, 188, 216];
indsImpulsivity                     = [4, 16, 17, 22, 58, 204];
indsIntimacyAvoidance               = [89, 97, 108, 120, 145, 203];
indsIrresponsibility                = [31, 129, 156, 160, 171, 201, 210];
indsManipulativeness                = [107, 125, 162, 180, 219];
indsPerceptualDysregulation         = [36, 37, 42, 44, 59, 77, 83, 154, 192, 193, 213, 217];
indsPerseveration                   = [46, 51, 60, 78, 80, 100, 121, 128, 137];
indsRestrictedAffectivity           = [8, 45, 84, 91, 101, 167, 184];
indsRigidPerfeccionism              = [34, 49, 105, 115, 123, 135, 140, 176, 196, 220];
indsRiskTaking                      = [3, 7, 35, 39, 48, 67, 69, 87, 98, 112, 159, 164, 195, 215];
indsSeparationInsecurity            = [12, 50, 57,64, 127, 149, 175];
indsSubmissiveness                  = [9, 15, 63, 202];
indsSuspiciousness                  = [2, 103, 117, 131, 133, 177, 190];
indsUnusualBeliefsAndExperiences    = [94, 99, 106, 139, 143, 150, 194, 209];
indsWithdrawal                      = [10, 20, 75, 82, 136, 146, 147, 161, 182, 186];

% get the average scores

ScoreAnhedonia                       = mean(Responses(indsAnhedonia));
ScoreAnxiousness                     = mean(Responses(indsAnxiousness));
ScoreAttentionSeeking                = mean(Responses(indsAttentionSeeking));
ScoreCallousness                     = mean(Responses(indsCallousness));
ScoreDeceitfulness                   = mean(Responses(indsDeceitfulness));
ScoreDepressivity                    = mean(Responses(indsDepressivity));
ScoreDistractivility                 = mean(Responses(indsDistractivility));
ScoreEccentricity                    = mean(Responses(indsExcentricity));
ScoreEmotionalLability               = mean(Responses(indsEmotionalLability));
ScoreGrandiosity                     = mean(Responses(indsGrandiosity));
ScoreHostility                       = mean(Responses(indsHostility));
ScoreImpulsivity                     = mean(Responses(indsImpulsivity));
ScoreIntimacyAvoidance               = mean(Responses(indsIntimacyAvoidance));
ScoreIrresponsibility                = mean(Responses(indsIrresponsibility));
ScoreManipulativeness                = mean(Responses(indsManipulativeness));
ScorePerceptualDysregulation         = mean(Responses(indsPerceptualDysregulation));
ScorePerseveration                   = mean(Responses(indsPerseveration));
ScoreRestrictedAffectivity           = mean(Responses(indsRestrictedAffectivity));
ScoreRigidPerfeccionism              = mean(Responses(indsRigidPerfeccionism));
ScoreRiskTaking                      = mean(Responses(indsRiskTaking));
ScoreSeparationInsecurity            = mean(Responses(indsSeparationInsecurity));
ScoreSubmissiveness                  = mean(Responses(indsSubmissiveness));
ScoreSuspiciousness                  = mean(Responses(indsSuspiciousness));
ScoreUnusualBeliefsAndExperiences    = mean(Responses(indsUnusualBeliefsAndExperiences));
ScoreWithdrawal                      = mean(Responses(indsWithdrawal));



%% Step 3: Compute the Personality Trait Domain Scores using the Domain Table


ScoreDomainNegativeAffect = mean([ScoreEmotionalLability,ScoreAnxiousness, ScoreSeparationInsecurity]);
ScoreDomainDetachment     = mean([ScoreWithdrawal, ScoreAnhedonia, ScoreIntimacyAvoidance]);
ScoreDomainAntagonism     = mean([ScoreManipulativeness, ScoreDeceitfulness, ScoreGrandiosity]);
ScoreDomainDisinhibition  = mean([ScoreIrresponsibility, ScoreImpulsivity, ScoreDistractivility]);
ScoreDomainPsychoticism   = mean([ScoreUnusualBeliefsAndExperiences, ScoreEccentricity, ScorePerceptualDysregulation]);

figure
bar([ScoreDomainNegativeAffect,ScoreDomainDetachment,ScoreDomainAntagonism,ScoreDomainDisinhibition,ScoreDomainPsychoticism])
set(gca,'xTickLabels',{'NegAff', 'Detach', 'Antag', 'Disinh', 'Psych'})




