<template>
  <div class="text-center mx-md-5 col-5">
    <h1 class="font-weight-bold">Register</h1>
    <p class="normal-text text-secondary mb-5">Join our community now by signing up!</p>

    <div v-if="errorMessage" class="alert alert-danger mt-3 text-start" role="alert">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleSubmit" class="mt-3">
      <div class="form-group">
        <input type="email" class="form-control" id="emailInput" placeholder="Email address" required v-model="email" />
      </div>

      <div class="form-group">
        <input type="password" class="form-control" id="passwordInput" placeholder="Password" required
          v-model="password" />
      </div>

      <div class="d-grid">
        <button type="submit" class="btn btn-outline-primary btn-block">
          <div v-if="submitting" class="spinner-border text-light" role="status"
            :style="{ width: '1rem', height: '1rem' }">
            <span class="visually-hidden sr-only">Loading...</span>
          </div>
          <span v-else>Sign up</span>
        </button>
      </div>
    </form>
    <div class="mt-4">
      <div>
        <span class="me-2 normal-text text-secondary">Already a member?</span>
      </div>
      <div>
        <router-link to="/login">Log into your account</router-link>
      </div>
    </div>


  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      submitting: false,
      errorMessage: null,
    }
  },
  created() {
    // verify if alreay login
    const token = localStorage.getItem('access_token');
    if(token != ""){
      // Navigate to home screen
      this.$router.push("/");
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
        const response = await fetch(`${this.$config.baseURL}/user/register`, {
          method: "POST",
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success) {
          // Navigate to home screen
          this.$router.push("/login");
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