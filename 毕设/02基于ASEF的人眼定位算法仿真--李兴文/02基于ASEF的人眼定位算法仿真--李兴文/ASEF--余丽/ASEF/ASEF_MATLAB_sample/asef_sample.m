clear
clc
image=imread('face.jpg');%��ȡ�沿ͼ�񣬴�СΪ128��128
double_f=zeros(128,128);
lookup=zeros(1,256);%���ұ�
for i=1:256
    lookup(i)=log(i);%������ұ�
end
[row, col, dim]=size(image);
for i=1:row
    for j=1:col
    double_f(i,j)=lookup(image(i,j)+1);
    end
end
tic;
dft_image=fft2(double_f);%�沿ͼ���dft

%����dft
left_filter=load('left_filter.txt');
left_filter_dft=fft2(left_filter);
%����dft
right_filter=load('right_filter.txt');
right_filter_dft=real(fft2(right_filter));
%�����˲����
left_filter_reslut=real(dft_image.*left_filter_dft);
%�����˲����
right_filter_result=real(dft_image.*right_filter_dft);

%�����˲����ת��������
left_filter_ifft=real(ifft2(dft_image.*left_filter_dft));

%�����˲����ת��������
right_filter_ifft=ifft2(dft_image.*right_filter_dft);

%�������۵����ĵ�
left_eye_region=left_filter_ifft(35:66,23:54);
result=find(left_eye_region==max(left_eye_region(:)));
left_eye_x=mod(result,32)+23;
left_eye_y=rem(result,32)+35;
%�������۵����ĵ�
right_eye_region=right_filter_ifft(32:63,71:102);
result=find(right_eye_region==max(right_eye_region(:)));

right_eye_x=mod(result,32)+71;
right_eye_y=rem(result,32)+32;
imshow(image)


