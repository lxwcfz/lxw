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
TestFacePath='测试人脸\';           %测试图像所在目录
%TestFacePath='训练人脸\';          %训练图像所在目录


%1 打开train目录中所有图像
load ASEF_H.mat  %加载已训练的滤波器

ImgName=dir([TestFacePath '*.*']); 
for n=3:length(ImgName)
     fn=[TestFacePath ImgName(n).name];
     Img=imread(fn);
     Img=imresize(Img,[128 128],'bicubic');  %归成相同大小
     [N M dim]=size(Img);
     if (dim>1)
        Img=rgb2gray(Img); %变成灰度图 
     end
%      figure(1),
%      subplot(1,2,1)
     %imshow(Img),title(['第' num2str(n-2) '个测试人脸'])
     Img=double(Img);
     %图像归一化
     t=log(Img+1);
     t=t-mean(t(:));
     A=sum(t.^2);
     A=sum(A);
     t=t/A;
     %加窗
     W=CosineWindows(Img);
     t=t.*W;
     figure(2),mesh (W); figure(gcf),title('窗')
     
    T=fft2(t);
    T=T.*H;  %相关性
    g=ifft2(T);
    %计算出检测出来的人眼位置
    [v idx]=max(g(:));
    y0=mod(idx,N);  %检测出来的人眼位置
    x0=floor(idx/N);

    %转化成类度图，以利于显示
    Tmin=min(g(:));
    Tmax=max(g(:));
    g=255*((g-Tmin)/(Tmax-Tmin));
    g=uint8(g);
    
    figure(1),
    subplot(1,2,1),imshow(g)
    %在人眼位置上画个记号
    Img(y0,x0-5:x0+5)=255;
    Img(y0-5:y0+5,x0)=255;
    subplot(1,2,2),imshow(uint8(Img)),title(['第' num2str(n-2) '个测试人脸'])
    pause(5)
end

disp('ASEF测试完成')

%二维cosine窗
function W=CosineWindows(I)
    [N M]=size(I);
    W=ones(N,M)*(pi/2);
    x0=M/2;y0=N/2;
    R0=sqrt((N^2+M^2))/2;
    for r=1:N
        for c=1:M
            R=(r-y0)^2+(c-x0)^2;
            R=sqrt(R);
            t=R/R0;
            W(r,c)=(pi/2)*t;
        end
    end
    W=cos(W);
    
    
    
    
    
