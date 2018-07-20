
export default function getLanguage(){
    return (navigator.language || navigator.browserLanguage).toLowerCase()
}