<template>
  <div class="text-center col-10 col-sm-7 col-md-5 col-xl-3">
    <h1 class="font-weight-bold">Login</h1>
    <p class="normal-text text-secondary mb-4">Welcome to the object manager app</p>

    <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
      <b-icon icon="exclamation-triangle-fill" class="mr-2"></b-icon>
      <div>{{ errorMessage }}</div>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <input type="email" class="form-control" id="emailInput" placeholder="Email address" required v-model="email" />
      </div>

      <div class="form-group">
        <input type="password" class="form-control" id="passwordInput" placeholder="Password" required
          v-model="password" />
      </div>

      <div class="d-grid">
        <button type="submit" class="btn btn-primary btn-block">
          <div v-if="submitting" class="spinner-border text-light" role="status"
            :style="{ width: '1rem', height: '1rem' }">
            <span class="visually-hidden sr-only">Loading...</span>
          </div>
          <span v-else>Sign in</span>
        </button>
      </div>
    </form>
    <div class="mt-5">
      <div>
        <span class="normal-text text-secondary">Don’t have an account?</span>
      </div>
      <div>
        <router-link to="/register">Create new account</router-link>
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
      errorMessage: this.$route.query.error || null,
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
        const response = await fetch(`${this.$config.baseURL}/user/login`, {
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
          // Store access token
          localStorage.setItem("access_token", data.token);

          // Navigate to home screen
          this.$router.push("/");
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