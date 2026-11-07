import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const context={window:{}};
vm.runInNewContext(fs.readFileSync('scripts/driver-test-model.js','utf8'),context,{timeout:1000});
const model=context.window.P10XDriverTest;
const server=JSON.parse(fs.readFileSync('data/driver-personality-test.json','utf8'));
for(const key of ['questions','celebrities','ppfPackages','tintPackages','referrers']){
  assert.deepEqual(JSON.parse(JSON.stringify(model[key])),server[key],`${key}: client and server data must agree`);
}
assert.equal(model.questions.length,25);
assert.equal(model.celebrities.length,25);
assert.equal(new Set(model.questions.map(q=>q.id)).size,25);
assert.equal(new Set(model.celebrities.map(c=>c.gridIndex)).size,25);

// Golden results from the supplied P10X test cover all three package levels.
const fixtures=[
 {choices:[2,0,[4],3,0,2,2,0,3,2,0,2,2,2,1,2,2,2,2,2,2,2,2,2,0],ppf:15,tint:10,package:'ceramic',grade:'standard',match:'gordon_ramsay',security:'non-security',privacy:'jpj'},
 {choices:[1,1,[1],1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],ppf:32,tint:20,package:'hybrid',grade:'medium',match:'lee_chong_wei',security:'security',privacy:'grey'},
 {choices:[0,2,[0,1,2,3,4,5,6],0,2,0,0,2,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,2],ppf:56,tint:30,package:'full',grade:'high',match:'cristiano_ronaldo',security:'security',privacy:'dark'}
];
for(const fixture of fixtures){
  const answers=Object.fromEntries(fixture.choices.map((answer,i)=>[i+1,answer]));
  const score=model.score(answers);
  assert.equal(score.ppfScore,fixture.ppf);assert.equal(score.tintScore,fixture.tint);
  assert.equal(score.ppfRec,fixture.package);assert.equal(score.tintGrade,fixture.grade);
  assert.equal(score.securitySignal,fixture.security);assert.equal(score.privacySignal,fixture.privacy);
  assert.equal(model.match(answers,'Proton X70').id,fixture.match);
}
console.log('Driver test: 25 questions, 25 matches, shared data and original golden results verified.');
