<template>
<ul>
    <li v-for="(nav,key) in nav_list" :key="key">
        <button>{{ nav }}</button>
    </li>
</ul>
</template>

<script>
export default {
    name: 'home',
    data() {
        return {
            nav_list: {
                first: "first",
                second: "second",
                third: "third"
            }
        }
    }
} 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul,li{
    display: inline-block;
}
ul{
    width: 100%;
}
</style>
