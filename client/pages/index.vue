<template>
  <!-- Object list -->
  <div class="container-fluid mt-5 col-12 col-sm-10 col-md-8 col-xl-6">
    <div class="row text-center mb-4">
      <div class="mx-auto">
        <h1 class="font-weight-bold">Object manager</h1>
      </div>

    </div>
    <div class="row mx-auto">
      <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center col-12" role="alert">
        <b-icon icon="exclamation-triangle-fill" class="mr-2"></b-icon>
        <div>{{ errorMessage }}</div>
      </div>
      <div v-if="successMessage" class="alert alert-success d-flex align-items-center col-12" role="alert">
        <b-icon icon="check-circle-fill" class="mr-2"></b-icon>
      <div>{{ successMessage }}</div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 py-3">
        <div class="d-grid gap-3">
          <router-link to="/create" class="btn btn-primary">
            <b-icon icon="plus-circle"></b-icon>
            <span class="ms-3">New object</span>
          </router-link>
          <button type="button" class="btn btn-danger float-right" @click="handleLogout()">
            <b-icon icon="box-arrow-right"></b-icon>
            Logout
          </button>

          <div v-for="object in objects" :key="object._id" class="card mt-1">
            <h5 class="card-header">{{ object.name }}</h5>
            <div class="card-body">
              <p class="card-text">{{ object.description }}</p>

              <div class="d-grid gap-2 d-md-block">
                <router-link :to="`/edit/${object._id}`" type="button" class="btn btn-outline-primary">
                  <b-icon icon="pencil"></b-icon>
                  Edit
                </router-link>

                <button type="button" class="btn btn-outline-danger" @click="handleDelete(object._id)">
                  <b-icon icon="trash"></b-icon>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      objects: [],
      errorMessage: this.$route.query.error || null,
      successMessage: this.$route.query.info || null
    };
  },
  middleware: 'auth',
  created() {
    this.getObjects();
  },
  methods: {
    async getObjects() {
      // Get all available objects
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${this.$config.baseURL}/objects`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          this.objects = data.list;
        }
        else {
          // remove invalid token
          localStorage.setItem("access_token", null);
          // Navigate to home screen
          this.$router.push({ path: "/login", query: { error: data.error } });
        }
      } catch (error) {
        // Display error message in case of error
        this.errorMessage = "Something went wrong.";
      }
    },
    async handleDelete(id) {
      // Get all available objects
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${this.$config.baseURL}/object/${id}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          this.successMessage = `<${data.deletedObject.name}> has been deleted`;
          // refresh object list
          this.getObjects();
        }
        else {
          this.errorMessage = data.error;
        }
      } catch (error) {
        // Display error message in case of error
        this.errorMessage = "Something went wrong.";
      }
    },
    async handleLogout() {
      // remove token
      localStorage.setItem("access_token", "");
      // Navigate to home screen
      this.$router.push("/login");
    }
  },
};
</script>