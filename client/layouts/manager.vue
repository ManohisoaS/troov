<template>
    <div class="container-fluid bg-light">
        <div class="mt-4 ml-4">
            <router-link to="/" class="btn btn-light">
                <b-icon icon="chevron-left"></b-icon>
                Back home
            </router-link>
        </div>
        <div class="row bg-light d-flex justify-content-center align-items-center">
            
            <div
                class="col d-flex justify-content-center align-items-center col-12 col-md-8 col-lg-6 bg-light text-dark">
                <nuxt />
            </div>
        </div>
    </div>
</template>
