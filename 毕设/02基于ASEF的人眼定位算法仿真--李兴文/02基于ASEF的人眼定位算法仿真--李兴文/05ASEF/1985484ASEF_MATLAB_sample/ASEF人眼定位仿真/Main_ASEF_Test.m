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
TestFacePath='��������\';           %����ͼ������Ŀ¼
%TestFacePath='ѵ������\';          %ѵ��ͼ������Ŀ¼


%1 ��trainĿ¼������ͼ��
load ASEF_H.mat  %������ѵ�����˲���

ImgName=dir([TestFacePath '*.*']); 
for n=3:length(ImgName)
     fn=[TestFacePath ImgName(n).name];
     Img=imread(fn);
     Img=imresize(Img,[128 128],'bicubic');  %�����ͬ��С
     [N M dim]=size(Img);
     if (dim>1)
        Img=rgb2gray(Img); %��ɻҶ�ͼ 
     end
%      figure(1),
%      subplot(1,2,1)
     %imshow(Img),title(['��' num2str(n-2) '����������'])
     Img=double(Img);
     %ͼ���һ��
     t=log(Img+1);
     t=t-mean(t(:));
     A=sum(t.^2);
     A=sum(A);
     t=t/A;
     %�Ӵ�
     W=CosineWindows(Img);
     t=t.*W;
     figure(2),mesh (W); figure(gcf),title('��')
     
    T=fft2(t);
    T=T.*H;  %�����
    g=ifft2(T);
    %�����������������λ��
    [v idx]=max(g(:));
    y0=mod(idx,N);  %������������λ��
    x0=floor(idx/N);

    %ת�������ͼ����������ʾ
    Tmin=min(g(:));
    Tmax=max(g(:));
    g=255*((g-Tmin)/(Tmax-Tmin));
    g=uint8(g);
    
    figure(1),
    subplot(1,2,1),imshow(g)
    %������λ���ϻ����Ǻ�
    Img(y0,x0-5:x0+5)=255;
    Img(y0-5:y0+5,x0)=255;
    subplot(1,2,2),imshow(uint8(Img)),title(['��' num2str(n-2) '����������'])
    pause(5)
end

disp('ASEF�������')

%��άcosine��
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
    
    
    
    
    
