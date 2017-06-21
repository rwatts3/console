import test from 'ava'
import onboarding from './onboarding'
import signup from './signup'
import createProject from './createProject'
import sss from './sss'
import rp from './rp'
import updatePermission from './updatePermission'
import createPermission from './createPermission'
import databrowser from './databrowser'
import playground from './playground'
import {deleteCustomer, extractCustomerInfo} from './deleteUser'

let cookies: any[] = []

test.before('signup, get cookie and run onboarding', async t => {
  console.log('######### signup')
  cookies = await signup()
  console.log('######### onboarding')
  await onboarding(cookies)
})

test.after.always('delete user', async () => {
  console.log('Deleting User')
  const customerInfo = extractCustomerInfo(cookies)
  try {
    const deleteResult = await deleteCustomer(customerInfo)
    console.log(deleteResult)
  } catch (e) {
    // it's not critical to delete the customer as we delete them every night
  }

})

// test('create project', async t => {
//   const projectName = await createProject(cookies)
//   t.is(projectName, 'Very Long Test Project Name')
//   t.pass()
// })

test('create and update sss', async t => {
  console.log('######### sss')
  await sss(cookies)
  t.pass()
})

// test('create and update rp', async t => {
//   console.log('######### rp')
//   await rp(cookies)
//   t.pass()
// })

test('updatePermission', async t => {
  console.log('######### updatePermission')
  const permissionLabel = await updatePermission(cookies)
  t.is(permissionLabel, 'Authenticated')
  t.pass()
})
//
// test('createPermission', async t => {
//   console.log('######### createPremission')
//   const permissionLabel = await createPermission(cookies)
//   t.is(permissionLabel, 'Authenticated')
//   t.pass()
// })

test('databrowser', async t => {
  console.log('######### databrowser')
  await databrowser(cookies)
  t.pass()
})

test('playground', async t => {
  console.log('######### playground')
  await playground(cookies)
  t.pass()
})
