export const state = () => {
    return {
        fixDate : new Date(),
        fixRate : {}
    }
}

export const mutations = {
    setFixDate(state) {
        state.fixDate = new Date();
    },

    setFixRate(state, rate) {
        state.fixRate = rate;
    },
}