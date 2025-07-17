// // const array_ = [3,2,4,6,8];


// // function swap(arr,i,j){
// //     let temp = arr[j];
// //     arr[j]=arr[i];
// //     arr[i]=temp;    
// // }

// // function sort(arr){
// //     for (let i = 1; i < arr.length; i++) {
// //         // if(arr[i]>arr[i-1]){
            
// //         // }
// //         for (let j = 0; j< arr.length; j++) {
// //             if (arr[j]<arr[j-1]) {
// //                 swap(arr,j-1,j);
// //             }
// //         }

// //     }
// //     return arr;
// // }

// // console.log(sort(array_));


// let obj = {}

// let arr = [1,5,2,6,3,7,8,10,100,10];

// for(let i of arr){
//     if(obj[i] && obj[i].length){
//         obj[i].push(i);
//     }
//     else{
//         obj[i]=[i];
//     }
// }


// console.log(Object.values(obj).flat());






function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]]; 
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; 
    return i + 1;
}

function quickSort(arr, low, high) {
    if (low >= high) return;
    let pi = partition(arr, low, high);

    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
}

let arr = [10, 80, 30, 90, 40];
console.log("Original array: " + arr);

quickSort(arr, 0, arr.length - 1);
console.log("Sorted array: " + arr);