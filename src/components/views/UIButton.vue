<template>

    <button class="register-button center-horizontal" :class="disabled ? color + ' disabled-cursor' : color + ' pointer'" @click="click" :disabled="disabled">
        <p style="margin-top: 5px" class="black">{{ title }}</p>
    </button>
    <button class="register-button center-horizontal shadow absolute on-bottom" @click="click">

    </button>

</template>


<script>

export default {
    name: "UIButton",
    data() {
        return {
        };
    },

    props: {
        title: String,
        color: String,
        disabled: Boolean
    },

    created() {
    },
    mounted() {
        
    },



    methods: {

        click() {
            this.$emit("click")
        },


        getCookies(key) {
            return this.$cookies.get(key);
        },
        setCookies(key, value) {
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>