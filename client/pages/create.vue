<template>
    <div class="col-6 mt-5">

        <h1 class="text-center font-weight-bold">New object</h1>
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

            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-block">
                    <div v-if="submitting" class="spinner-border text-light" role="status"
                        :style="{ width: '1rem', height: '1rem' }">
                        <span class="visually-hidden sr-only">Loading...</span>
                    </div>
                    <span v-else>Create</span>
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
    methods: {
        async handleSubmit() {
            try {
                // Reset error message
                this.errorMessage = null;

                // Form is submitting
                this.submitting = true;

                // Send login request
                const token = localStorage.getItem('access_token');
                const response = await fetch(`${this.$config.baseURL}/object`, {
                    method: "POST",
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
                    this.successMessage = `"${data.newObject.name}" object created`;
                    // reset inputs
                    this.name = null;
                    this.description = null;
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
    },
};
</script>