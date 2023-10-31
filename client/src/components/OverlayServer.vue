<script setup>
function reloadPage() {
    location.reload();
}
</script>

<template>
    <!-- header -->
    <div class="header-container">
        <h1>Server not running</h1>
    </div>

    <!-- content -->
    <div class="content-container">
        <p>
            This application requires the server app to be running. <br />
            You can find the server app in the GitHub releases
            <a href="https://github.com/tunalad/vue-kanban/releases">here</a>.
        </p>
    </div>

    <!-- footer -->
    <div class="footer-container">
        <button @click="reloadPage">Retry</button>
    </div>
</template>
<style scoped>
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
}
.header-container h1 {
    margin: 0 0;
    white-space: normal;
    word-break: break-all;
    width: 100%;
}
.footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
}
</style>
