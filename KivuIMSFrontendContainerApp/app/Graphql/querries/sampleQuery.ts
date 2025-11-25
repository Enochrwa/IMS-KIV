export const sampleQuery = `
mutation Sample($input: SampleInput!) {
    Sample(input: $input, file: $file) {
      sample {
        id
        name
      }
    }
}
`;
