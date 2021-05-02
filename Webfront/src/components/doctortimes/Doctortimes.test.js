import {render,screen , cleanup} from "@testing-library/react"
import Doctorcalender from "./Doctorcalender"




test("see the hozori title",()=>{
    render(<Doctorcalender/>);
    const todoelement=screen.get("hozoritext");
    expect(todoelement).toHaveTextContent("مدت زمان هر وقت حضوری شما؟")
})

test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
  });

test("t" ,()=>{

})