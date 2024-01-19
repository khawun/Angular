<script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import axios from 'axios';
    import Modal from './CountryModal.vue';

    const countries = ref([]);
    const searchTerm = ref('');
    const sortOrder = ref('asc'); // Default sorting order
    const itemsPerPage = 25;
    const currentPage = ref(1);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            countries.value = response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const sortedCountries = computed(() => {
        const term = searchTerm.value.toLowerCase();
        const sorted = [...countries.value].sort((a, b) => {
            const nameA = a.name.official.toLowerCase();
            const nameB = b.name.official.toLowerCase();
            if (sortOrder.value === 'asc') {
            return nameA.localeCompare(nameB);
            } else {
            return nameB.localeCompare(nameA);
            }
        });
    return sorted.filter((country) => country.name.official.toLowerCase().includes(term));
    });

    const totalPages = computed(() => Math.ceil(sortedCountries.value.length / itemsPerPage));

    const paginatedCountries = computed(() => {
        const startIndex = (currentPage.value - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedCountries.value.slice(startIndex, endIndex);
    });

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    };

    const selectedCountry = ref(null);

    const openModal = (country) => {
    selectedCountry.value = country;
    console.log(selectedCountry.value);
    };

    const closeModal = () => {
    selectedCountry.value = null;
    };

    onMounted(() => {
    fetchData();
    });
</script>
<template>
    <div>
        <div>
            <h1>Country List</h1>
            <div>
                <label>Search By Name</label><input v-model="searchTerm" placeholder="Search by country name" />
                <label>Sort By</label>
                <select v-model="sortOrder">
                    <option value="asc">Sort by Name (Ascending)</option>
                    <option value="desc">Sort by Name (Descending)</option>
                </select>
            </diV>
        </div>
        <table>
            <thead>
                <tr>
                <th>Flags && name</th>
                <th>2 character Country Code</th>
                <th>3 character Country Code</th>
                <th>Native Country Name</th>
                <th>Alternative Country Name</th>
                <th>Country Calling Codes</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="country in paginatedCountries" :key="country.cca3" @click="openModal(country)">
                <td>
                    <h2>{{ country.name.official }}</h2>
                    <img :src="country.flags.png" alt="Country Flag" />
                </td>
                <td>{{ country.cca2 }}</td>
                <td>{{ country.cca3 }}</td>
                <td>{{ country.name.nativeName }}</td>
                <td>{{ country.altSpellings }}</td>
                <td>{{ country.idd }}</td>
                </tr>
            </tbody>
        </table>
        <Modal :country="selectedCountry" @close="closeModal" v-if="selectedCountry" />
        <div>
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
        </div>
    </div>
</template>




