data = readtable('confidence_n.txt');
data = table2array(data);
data = transpose(data);

% d'
da = zeros(1,length(data)/16);
% meta d'
meta_d = zeros(1,length(data)/16);
% difference meta_da - da
M_diff = zeros(1,length(data)/16);
% meta_da / da
M_ratio = zeros(1,length(data)/16);

pos = 1;

for i = 1:length(meta_d)
       vecS1 = data(1,pos:pos+7);
       vecS2 = data(1,pos+8:pos+15);
       
       % meta d' function
       fit = fit_meta_d_MLE(vecS1, vecS2);
       
       da(i) = fit.da;
       meta_d(i) = fit.meta_da;
       M_diff(i) = fit.M_diff;
       M_ratio(i) = fit.M_ratio ;
       
       pos = pos + 16;
end

% save the data as .txt
da = transpose(da);
save('da.txt','da','-ascii')

meta_d = transpose(meta_d);
save('meta_d.txt','meta_d','-ascii')

M_diff = transpose(M_diff);
save('M_diff.txt','M_diff','-ascii')

M_ratio = transpose(M_ratio);
save('M_ratio.txt','M_ratio','-ascii')
