let choice_array = [{label: 'Option 1', probability: 0}, {label: 'Option 2', probability: 0}]
let start = document.getElementById('start')
let spin_wheel = document.getElementById('rotation')
let spin_wheel_wrapper = document.getElementById('rotation_wrapper')
let table = document.getElementById("select_table")
let add_row = document.getElementById('add_row')
let winner_field = document.getElementById('winner')
let timeout = undefined
let last_option_number = 3
let probability_mode = document.getElementById('probability_mode')
let error = document.getElementById('error')
let blinking_border = document.getElementById('blinking_border')
function change_probability_inputs_display(){
    //hide or show inputs
    let inputs = document.querySelectorAll('.custom_probability_input')
    if(probability_mode.value === 'equal'){
        inputs.forEach((i)=>{
            i.style.display = 'none';
        });
    }
    else if(probability_mode.value === 'custom'){
        inputs.forEach((i)=>{
            i.style.display = 'initial';
        });
    }
}
function set_equal_probabilities(){
    for (let i in choice_array){
        choice_array[i]['probability'] = Math.round(100/choice_array.length)
    }
    let prob_sum = 0
    for (let i in choice_array){
        prob_sum += choice_array[i]['probability']
    }
    if(prob_sum < 100){
        choice_array[choice_array.length-1]['probability'] += 100-prob_sum
    }
    else if (prob_sum > 100){
        choice_array[choice_array.length-1]['probability'] -= prob_sum-100
    }
    update_table()
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function clear_wheel_spin(){
    //update start/reset button
    spin_wheel.style.removeProperty('transform')
    start.classList.remove('start_color')
    spin_wheel_wrapper.classList.remove('spin_ann_class')
    if (start.textContent==='RESET'){
        start.textContent='START'
    }
    clearTimeout(timeout)
    winner_field.classList.remove('text_blink_class')
    winner_field.textContent = ``

}
function create_table_row(number, number_of_rows){
    let row = document.createElement('tr')

    let td1 = document.createElement('td')
    let input1 = document.createElement('input')
    input1.setAttribute('type', 'text')
    input1.setAttribute('maxlength', 27)
    input1.value = choice_array[number]['label']
    td1.appendChild(input1)

    let wheel_text = document.createElement('div')
    wheel_text.classList.add('wheel_text')
    let text_vis = document.createElement('div')
    text_vis.classList.add('wheel_text_visible')
    text_vis.textContent = choice_array[number]['label']
    wheel_text.style.transform = `rotate(${360/number_of_rows*number}deg)`

    wheel_text.appendChild(text_vis)
    spin_wheel.appendChild(wheel_text)

    input1.addEventListener('input', (e)=>{
        choice_array[number]['label'] = e.target.value
        text_vis.textContent = e.target.value
        clear_wheel_spin()
    })


    let td2 = document.createElement('td')
    let input2 = document.createElement('input')
    input2.setAttribute('type', 'number')
    input2.value = choice_array[number]['probability']
    input2.classList.add('custom_probability_input')
    td2.appendChild(input2)
    input2.addEventListener('change', (e)=>{
        error.style.visibility = 'hidden'
        clear_wheel_spin()
        // parse to int [0,100]
        let input_number = parseInt(e.target.value)
        if (isNaN(input_number)){
            input_number = 0
        }
        input_number = Math.floor(input_number)
        if (input_number<0){input_number=0}
        else if (input_number>100){input_number=100}
        input2.value = input_number
        choice_array[number]['probability'] = input_number
    })

    let del_button = document.createElement('button')
    del_button.classList.add('delete_button')
    del_button.textContent = '-'
    del_button.addEventListener('click', ()=>{
        choice_array.splice(number, 1)
        update_table()
        clear_wheel_spin()

    })
    let button_td = document.createElement('td')
    button_td.appendChild(del_button)


    row.appendChild(td1)
    row.appendChild(td2)
    row.appendChild(button_td)

    return row

}
function create_line(){
    let main_line = document.createElement('div')
    main_line.classList.add('line')
    let inv = document.createElement('div')
    inv.classList.add('line_invisible')
    let vis = document.createElement('div')
    inv.classList.add('line_visible')
    main_line.appendChild(inv)
    main_line.appendChild(vis)
    return main_line
}
function clear_wheel() {
    //clear wheel

    spin_wheel_wrapper.removeChild(spin_wheel)
    spin_wheel = document.createElement('div')
    spin_wheel.id = 'rotation'
    spin_wheel_wrapper.appendChild(spin_wheel)
}
function create_wheel_lines(number){
    for (let i =1; i<=number; i++){
        let line = create_line()
        line.id = i.toString()
        line.style.transform = `rotate(${360/number*i + 360/number/2}deg)`
        spin_wheel.appendChild(line)
    }
}
function update_table(){
    // clear table
    table = document.getElementById('select_table')
    for (let i=table.children.length-1; i>0; i--){
        table.removeChild(table.children[i])
    }
    clear_wheel()
    // create rows and wheel labels
    for (let i in choice_array){
        table.appendChild(create_table_row(i, choice_array.length))
    }
    // create wheel lines
    create_wheel_lines(choice_array.length)
    change_probability_inputs_display()
    error.style.visibility = 'hidden'

}
function start_wheel_spin_process(){
    if (start.textContent==='START') {
        let winning_number = 0
        // draw winning result
        if (probability_mode.value === 'custom') {
            let probabilities_sum = 0
            for (let i in choice_array) {
                probabilities_sum += choice_array[i]['probability']
            }
            if (probabilities_sum == 100) {
                let draw_number = getRandomInt(1, 100)
                let sum = 0
                for (let i in choice_array) {
                    if (sum + choice_array[i]['probability'] >= draw_number) {
                        winning_number = i
                        break
                    } else {
                        sum += choice_array[i]['probability']
                    }
                }
                error.style.visibility = 'hidden'
                rotate_the_wheel(winning_number)
            }
            else
            {
                error.textContent = `Probabilities sum must be equal to 100, current sum: ${probabilities_sum}`
                error.style.visibility = 'visible'

            }
        }
        else if (probability_mode.value === 'equal'){
            winning_number = getRandomInt(0, choice_array.length - 1)
            rotate_the_wheel(winning_number)
        }
    }
    else{clear_wheel_spin()}

}
function rotate_the_wheel(winning_number){
    let field_deg = 360 / choice_array.length
    /*
    real-feel margin
    //cases
        0-0,5 (normal)
    let additional_margin = getRandomInt(0, field_deg / 2 - 1)
        0,25 - 0,5 (mild emotions)
    let additional_margin = getRandomInt(field_deg/4, field_deg / 2 - 1)
        0,45 - 0,5 (big emotions)
    let additional_margin = getRandomInt(field_deg/20*9, field_deg / 2 - 1)
        0,47 - 0,5 (max emotions)
    let additional_margin = getRandomInt(field_deg/100*47, field_deg / 2 - 1)
     */
    let additional_margin = getRandomInt(field_deg / 10*4, field_deg / 2 - 2)

    //plus or minus
    if (getRandomInt(0, 1) === 0) {
        additional_margin *= -1
    }
    let rotate_to_winner = 360 - winning_number * field_deg + additional_margin
    start.textContent = 'RESET'
    start.classList.add('start_color')
    spin_wheel_wrapper.classList.add('spin_ann_class')
    // disable wheel blink during rotation
    blinking_border.style.borderStyle= 'solid'
    blinking_border.style.animationName = `none`
    spin_wheel.style.transform = `rotate(${rotate_to_winner}deg)`
    timeout = setTimeout(() => {
        winner_field.textContent = `${choice_array[winning_number]['label']}`
        //enable wheel blink
        blinking_border.style.removeProperty('border-style')
        blinking_border.style.removeProperty('animation-name')
        winner_field.classList.add('text_blink_class')
        spin_wheel_wrapper.classList.remove('spin_ann_class')
    }, 10000)
}
probability_mode.addEventListener('change', ()=>{
    clear_wheel_spin()
    error.style.visibility = 'hidden'
    change_probability_inputs_display()
})
add_row.addEventListener('click', ()=>{
    if(choice_array.length<20){
        choice_array.push({
            probability: 0,
            label: `Option ${last_option_number}`
        })
        last_option_number += 1
        update_table()
        clear_wheel_spin()
    }

})
start.addEventListener('click', ()=>{
        start_wheel_spin_process()
    })
blinking_border.addEventListener('click', ()=>{
    start_wheel_spin_process()
})
/*document.getElementById('equal_probabilities').addEventListener('click', ()=>{
    set_equal_probabilities()
})
 */
// calling update table to create 2 existing options on page load
update_table()


