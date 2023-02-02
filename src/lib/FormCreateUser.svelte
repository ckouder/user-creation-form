<script lang="ts">
    import {onMount} from 'svelte';
    import {CREATE_USER_ENDPOINT} from "./api";
    import FormField from "./FormField.svelte";
    import type {CreateUserResponse, Occupation, SelectOption, State, UserInfo} from "./type";
    import {
        containCapitalLetters,
        containDigits,
        containNonCapitalLetters,
        containSpecialCharacters,
        isEmail,
        lengthBetween,
        notEmpty
    } from "./validators.js";

    let occupations: Array<SelectOption>;
    let states: Array<SelectOption>;
    let formIsInvalid: boolean = true;
    let userInfoErrors = {};
    let userinfo: UserInfo = {
        email: '',
        name: '',
        password: '',
        occupation: '',
        state: ''
    };
    let userInfoValidators = {
        email: {
            notEmpty,
            isEmail
        },
        name: {
            notEmpty,
            containNonCapitalLetters,
            containNoSpecialCharacters: (v) => !containSpecialCharacters(v),
        },
        password: {
            notEmpty,
            lengthBetween: lengthBetween(8, 16),
            containDigits,
            containSpecialCharacters,
            containCapitalLetters,
            containNonCapitalLetters,
        },
        occupation: [
            notEmpty,
        ],
        state: [
            notEmpty,
        ],
    }

    // Setup validators for password
    Object.keys(userInfoValidators).forEach((key: string) => {
        userInfoErrors[key] = {};
        Object.keys(userInfoValidators[key]).forEach((fn: string) => {
            userInfoErrors[key][fn] = false;
        });
        userInfoErrors[key].any = false;
    })

    onMount(async () => {
        const res = await CREATE_USER_ENDPOINT.get();
        const pleaseSelect = {name: 'Please Select', value: ''};
        occupations = res.occupations.map((v: Occupation) => ({name: v, value: v}));
        states = res.states.map((v: State) => ({name: v.name, value: v.abbreviation}));
        occupations.unshift(pleaseSelect);
        states.unshift(pleaseSelect);
    });

    function onFormFieldChange(name: string, value: unknown) {
        userinfo[name] = value;
        if (userInfoErrors[name] === undefined) {
            userInfoErrors[name] = {};
        }
        userInfoErrors[name].any = false;
        Object.keys(userInfoValidators[name]).forEach((validatorName: string) => {
            if (validatorName !== 'any') {
                let isValid = userInfoValidators[name][validatorName](value);
                userInfoErrors[name][validatorName] = isValid;
                userInfoErrors[name].any = userInfoErrors[name].any || !isValid;
            }
        })
        formIsInvalid = checkForm();
    }

    function onSubmit(e: MouseEvent) {
        e.preventDefault();
        CREATE_USER_ENDPOINT.post(userinfo).then(
            () => alert("You have successfully created a user!"),
            () => alert('Something went wrong, please try again later')
        );
    }

    function checkForm() {
        let isInvalid = false;
        Object.keys(userInfoErrors).forEach((field: string) => {
            isInvalid = (userInfoErrors[field].any || !userinfo[field].length) || isInvalid;
        })
        return isInvalid;
    }
</script>

<form>
    <FormField hint="Name is invalid."
               invalid="{userInfoErrors.name.any}"
               name="Name"
               on:input={(e) => onFormFieldChange('name', e.detail)}
               type="string"></FormField>
    <FormField hint="Email address is invalid"
               invalid="{userInfoErrors.email.any}"
               name="Email"
               on:input={(e) => onFormFieldChange('email', e.detail)}
               type="email"></FormField>
    <FormField invalid="{userInfoErrors.password.any}"
               name="Password"
               on:input={(e) => onFormFieldChange('password', e.detail)}
               type="password"></FormField>
    <div class="password-hints">
        <div>
            <input bind:checked="{userInfoErrors.password.lengthBetween}" disabled id="pwd-validator-length"
                   type="checkbox">
            <label for="pwd-validator-length">8-16 character</label>
        </div>
        <div>
            <input bind:checked="{userInfoErrors.password.containCapitalLetters}" disabled
                   id="pwd-validator-capital-letter" type="checkbox">
            <label for="pwd-validator-capital-letter"> &ge; 1 <b>C</b>apital letter </label>
        </div>
        <div>
            <input bind:checked="{userInfoErrors.password.containNonCapitalLetters}" disabled
                   id="pwd-validator-non-capital-letter" type="checkbox">
            <label for="pwd-validator-non-capital-letter"> &ge; 1 <b>s</b>mall letter</label>
        </div>
        <div>
            <input bind:checked="{userInfoErrors.password.containDigits}" disabled id="pwd-validator-number"
                   type="checkbox">
            <label for="pwd-validator-number">&ge; 1 number</label>
        </div>
        <div>
            <input bind:checked="{userInfoErrors.password.containSpecialCharacters}" disabled
                   id="pwd-validator-special-character" type="checkbox">
            <label for="pwd-validator-special-character">&ge; 1 special character</label>
        </div>
    </div>
    <FormField hint="Occupation is invalid"
               invalid="{userInfoErrors.occupation.any}"
               name="Occupation"
               on:input={(e) => onFormFieldChange('occupation', e.detail)}
               options="{occupations}"
               type="select"></FormField>
    <FormField hint="State is invalid"
               invalid="{userInfoErrors.state.any}"
               name="State"
               on:input={(e) => onFormFieldChange('state', e.detail)}
               options="{states}"
               type="select"></FormField>
    <button disabled="{formIsInvalid}" on:click={onSubmit}>Submit</button>
</form>

<style lang="sass">
  form
    display: flex
    flex-direction: column
    justify-content: start

    button
      background: black
      color: var(--background-color)

      &:disabled
        opacity: 0.5
        cursor: not-allowed

    .password-hints
      text-align: left
      margin-bottom: 1em

      > div
        display: flex
        align-items: center

        input[type="checkbox"]
          -webkit-appearance: none
          appearance: none
          background: transparent
          margin: 0 .4em 0 0
          height: 1em
          width: 1em
          border: 1px solid var(--border-color)
          border-radius: .3em

          &:checked
            background: var(--text-color)

</style>