<template>
  <!-- Object list -->
  <div class="container-fluid mt-5">
    <div class="row text-center mb-4">
      <div class="mx-auto">
        <h1 class="font-weight-bold">Object manager</h1>
      </div>

    </div>
    <div class="row">
      <div class="col-12 py-3">
        <div class="d-grid gap-3">
          <router-link to="/create" class="btn btn-primary">
            <b-icon icon="plus-circle"></b-icon>
            <span class="ms-3">New object</span>
          </router-link>
          <button type="button" class="btn btn-danger float-right">
            <b-icon icon="box-arrow-right"></b-icon>
            Logout
          </button>

          <div v-for="object in objects" :key="object._id" class="card mt-1">
            <h5 class="card-header">{{ object.name }}</h5>
            <div class="card-body">
              <p class="card-text">{{ object.description }}</p>

              <div class="d-grid gap-2 d-md-block">
                <router-link :to="`/edit/${object._id}`" type="button" class="btn btn-outline-info">
                  <b-icon icon="pencil"></b-icon>
                  Edit
                </router-link>

                <button type="button" class="btn btn-outline-danger">
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
      errorMessage: null
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
          console.log(data);
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
    }
  },
};
</script>