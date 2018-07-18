<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style>
* {
    margin: 0;
    padding: 0;
    font-size: 0;
}
#app {
    width: 100%;
    min-width: 1000px;
}
p,span,button{
    font-size: 14px;
}
button{
    background: none;
    border: none;
    cursor: pointer;
}
</style>
