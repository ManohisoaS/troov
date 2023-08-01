<template>
    <div class="mt-5 col-10 col-sm-8">

        <h1 class="text-center font-weight-bold">Edit object</h1>
        <div v-if="errorMessage" class="alert alert-danger mt-3 text-start" role="alert">
            {{ errorMessage }}
        </div>
        <div v-if="successMessage" class="alert alert-success mt-3 text-start" role="alert">
            {{ successMessage }}
        </div>

        <form @submit.prevent="handleUpdate" class="mt-4">
            <div class="form-group">
                <label for="nameInput" class="text-left">Name</label>
                <input type="text" class="form-control" id="nameInput" placeholder="Object name" required v-model="name" />
            </div>

            <div class="form-group">
                <label for="descriptionInput" class="text-left">Description</label>
                <textarea class="form-control" id="descriptionInput" rows="3" placeholder="Object description" required
                    v-model="description"></textarea>
            </div>

            <div class="d-flex justify-content-center text-center mt-4">
                <router-link to="/" class="btn btn-secondary col-5 mr-2">Cancel</router-link>
                <button type="submit" class="btn btn-primary col-5">
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
            submitting: false,
            errorMessage: null,
            successMessage: null,
        }
    },

    // Load information about object to inputs fields
    async asyncData({ $config, params, redirect }) {
        const id = params.id;
        if (id) {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${$config.baseURL}/object/${id}`, {
                method: "GET",
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (data.success) {
                return {
                    name: data.object.name,
                    description: data.object.description,
                    id
                }
            }
            else {
                // Navigate to home screen
                redirect("/");
            }
        }
        else {
            // Navigate to home screen if id is not defined in URL
            redirect("/");
        }
    },
    methods:{
        async handleUpdate() {
            try {
                // Reset error message
                this.errorMessage = null;

                // Form is submitting
                this.submitting = true;

                // Send login request
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${this.$config.baseURL}/object/${this.id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                        name: this.name,
                        description: this.description,
                    }),
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (data.success) {
                    this.successMessage = `<${data.updatedObject.name}> object is updated`;
                    // update inputs
                    this.name = data.updatedObject.name;
                    this.description = data.updatedObject.name;
                }
                else {
                    // Display error message returning by server
                    this.errorMessage = data.error;
                }

            } catch (error) {
                // Display error message in case of error
                if (
                    error.data &&
                    error.data.error
                ) {
                    this.errorMessage = error.data.error;
                } else {
                    this.errorMessage = "Something went wrong.";
                }
            } finally {
                // Form is no longer submitting
                this.submitting = false;
            }
        },
    }
}
</script>