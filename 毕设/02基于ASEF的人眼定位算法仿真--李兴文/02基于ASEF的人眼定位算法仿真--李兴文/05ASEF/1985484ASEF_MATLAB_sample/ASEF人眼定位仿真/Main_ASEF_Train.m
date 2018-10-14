function Main_ASEF_Train()
clc;close all;clear all;
%%%说明：下面这些句子是将当前目录下所有的子目录加为可搜索路径%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
files = dir(cd);
for i=1:length(files)
    if files(i).isdir & strcmp(files(i).name,'.') == 0  && strcmp(files(i).name,'..') == 0
        addpath([cd '/' files(i).name]);
    end
end
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%说明： 用ASEF方法进行人眼定位仿真
%      2010-12-15     www_ldx@163.com   李大湘
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
TrainFacePath='训练人脸\';          %训练图像所在目录
TestFacePath='测试人脸\';           %测试图像所在目录

%1 打开train目录中所有图像
FilterSet=[];Num=1;
ImgName=dir([TrainFacePath '*.*']); 
for n=3:length(ImgName)
     fn=[TrainFacePath ImgName(n).name];
     Img=imread(fn);
     Img=imresize(Img,[128 128],'bicubic');  %归成相同大小
     [N M dim]=size(Img);
     if (dim>1)
        Img=rgb2gray(Img); %变成灰度图 
     end
     figure(1),imshow(Img),title(['第' num2str(n-2) '个训练人脸'])
     %鼠标点击记录
     [cols rows p]=impixel;   %获得所选点的坐标与值 X宽  Y高
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
     H=G./F;  %滤波器
     FilterSet{Num}=H;
     Num=Num+1;
     save FilterSet.mat  FilterSet
end

%求平均
load FilterSet.mat
H=FilterSet{1};
for n=2:length(FilterSet)
    H=H+FilterSet{n};
end
H=H/length(FilterSet);
save ASEF_H.mat  H


disp('ASEF训练完成')
