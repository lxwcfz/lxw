export default function getHost(){

    let _HOST = window.location.origin;
    const _PATH = '/coron-web/bigc/';

    let base = document.createElement('base');
    base.href = _HOST + _PATH;
    base.target = "_blank";

    let _HEADElEMENT = document.head;

    let firstChild = _HEADElEMENT.firstChild;
    
    _HEADElEMENT.insertBefore(base,firstChild);

}