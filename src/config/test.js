import { setValue, getValue, getHValue, delValue } from './redisConfig';

setValue('lg', 'nizhenshabi');
// getValue('lg').then(value => {
//   console.log(value)
// });

setValue('zwq', {
  height: 150,
  weight: 200
});

getHValue('zwq').then(data => {
  console.log(data)
});

delValue('zwq');
