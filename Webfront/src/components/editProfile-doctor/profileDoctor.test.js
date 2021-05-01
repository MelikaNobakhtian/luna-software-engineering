import React from 'react';
import { shallow } from 'enzyme';
import Editprofile from "./editProfile-doctor";
    describe('Login component tests', ()=> {
        const wrapper = shallow(<Editprofile />);

        it('should have a btn component', ()=> {

      
            expect(wrapper.find('button')).toHaveLength(2);

            expect(wrapper.find('button')
            .type().defaultProps.type)
            .toEqual('submit');

          
            expect(wrapper.find('button').text()).toEqual('ذخیره تغییرات');
        });

        it('should have input for lastname and firstname', ()=> {
           
            expect(wrapper.find('input#firstNam')).toHaveLength(0);
            expect(wrapper.find('input#lastName')).toHaveLength(0);
        });

    });
