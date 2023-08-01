<template>
    <div class="col-6 mt-5">

        <h1 class="text-center font-weight-bold">Edit object</h1>
        <div v-if="errorMessage" class="alert alert-danger mt-3 text-start" role="alert">
            {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3 text-start" role="alert">
            {{ successMessage }}
        </div>

        <form @submit.prevent="handleSubmit" class="mt-4">
            <div class="form-group">
                <label for="nameInput" class="text-left">Name</label>
                <input type="text" class="form-control" id="nameInput" placeholder="Object name" required v-model="name" />
            </div>

            <div class="form-group">
                <label for="descriptionInput" class="text-left">Description</label>
                <textarea class="form-control" id="descriptionInput" rows="3" placeholder="Object description" required
                    v-model="description"></textarea>
            </div>

            <div class="d-grid ">
                <router-link to="/" class="btn btn-secondary">Cancel</router-link>
                <button type="submit" class="btn btn-primary">
                    <div v-if="submitting" class="spinner-border text-light" role="status"
                        :style="{ width: '1rem', height: '1rem' }">
                        <span class="visually-hidden sr-only">Loading...</span>
                    </div>
                    <span v-else>Save</span>
                </button>
            </div>
        </form>

    </div>
</template>

<script>
export default {
    middleware: 'auth',
    layout: "manager",
    data() {
        return {
            name: "",
            description: "",
            submitting: false,
            errorMessage: null,
            successMessage: null,
        }
    },

    fetch({ params }) {
        const id = params.id;
        console.log("ID : ", id);
        if (id) {
            //  get object information 
        }
        else {
            // Navigate to home screen
            this.$router.push("/");
        }
    }
}
</script>