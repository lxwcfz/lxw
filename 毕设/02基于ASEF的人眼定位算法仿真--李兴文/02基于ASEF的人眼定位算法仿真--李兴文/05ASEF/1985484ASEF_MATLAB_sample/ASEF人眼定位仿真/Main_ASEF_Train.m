function Main_ASEF_Train()
clc;close all;clear all;
%%%˵����������Щ�����ǽ���ǰĿ¼�����е���Ŀ¼��Ϊ������·��%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
files = dir(cd);
for i=1:length(files)
    if files(i).isdir & strcmp(files(i).name,'.') == 0  && strcmp(files(i).name,'..') == 0
        addpath([cd '/' files(i).name]);
    end
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%˵���� ��ASEF�����������۶�λ����
%      2010-12-15     www_ldx@163.com   �����
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
TrainFacePath='ѵ������\';          %ѵ��ͼ������Ŀ¼
TestFacePath='��������\';           %����ͼ������Ŀ¼

%1 ��trainĿ¼������ͼ��
FilterSet=[];Num=1;
ImgName=dir([TrainFacePath '*.*']); 
for n=3:length(ImgName)
     fn=[TrainFacePath ImgName(n).name];
     Img=imread(fn);
     Img=imresize(Img,[128 128],'bicubic');  %�����ͬ��С
     [N M dim]=size(Img);
     if (dim>1)
        Img=rgb2gray(Img); %��ɻҶ�ͼ 
     end
     figure(1),imshow(Img),title(['��' num2str(n-2) '��ѵ������'])
     %�������¼
     [cols rows p]=impixel;   %�����ѡ���������ֵ X��  Y��
     x0=cols(1);y0=rows(1);
     
     g=zeros(N,M);
     sigma=4.0;
     for r=1:N
         for c=1:M
            d=(r-y0)^2+(c-x0)^2;
            d=d/sigma^2;
            g(r,c)=exp(-d);
         end
     end
     
     F=fft2(double(Img));
     G=fft2(g);
     H=G./F;  %�˲���
     FilterSet{Num}=H;
     Num=Num+1;
     save FilterSet.mat  FilterSet
end

%��ƽ��
load FilterSet.mat
H=FilterSet{1};
for n=2:length(FilterSet)
    H=H+FilterSet{n};
end
H=H/length(FilterSet);
save ASEF_H.mat  H


disp('ASEFѵ�����')
