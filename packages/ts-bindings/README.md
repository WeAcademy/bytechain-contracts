# @weacademy/bytechain-shared (packages/ts-bindings)

Shared TypeScript types, API response contracts and Soroban contract bindings
for the ByteChain Academy repositories. This package used to live in its own
repository, [`WeAcademy/bytechain-shared`](https://github.com/WeAcademy/bytechain-shared),
which is now deprecated. It lives here so that contract changes and the
TypeScript types that describe them ship in the same pull request.

The npm package name is unchanged, so existing imports keep working.

## Installation

The package is published to GitHub Packages under the `@weacademy` scope.
Configure the registry once per consuming repository:

```bash
# .npmrc
@weacademy:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @weacademy/bytechain-shared
```

For local development against a checkout of this repository:

```bash
npm install ../bytechain-contracts/packages/ts-bindings
```

## Usage

```ts
import type {
  AuthResponseDto,
  CourseResponseDto,
  PaginatedResponse,
} from "@weacademy/bytechain-shared";

const response = await fetch(`${API_URL}/api/v1/courses`);
const courses = (await response.json()) as PaginatedResponse<CourseResponseDto>;
```

The package ships ESM (`dist/index.js`) and CommonJS (`dist/index.cjs`) builds
with declarations for each.

## What lives here

- **API response contracts**: the wire shapes the backend returns for auth,
  courses, lessons and enrolments (`src/types/`).
- **Pagination**: the shared `{ data, total, page, limit, totalPages }` envelope.
- **Soroban contract bindings** (planned): TypeScript clients generated from the
  contracts in `../../contracts/` with `stellar contract bindings typescript`.
  See [Contract bindings](#contract-bindings).

### Response contracts

| Type | Backend endpoint |
|---|---|
| `AuthResponseDto` | `POST /auth/register`, `POST /auth/login` |
| `RefreshTokenResponseDto` | `POST /auth/refresh` |
| `MessageResponseDto` | logout, forgot-password, reset-password |
| `CourseResponseDto` | `GET /courses`, `GET /courses/:id` |
| `CourseListResponseDto` | `GET /courses` |
| `LessonResponseDto` | lesson endpoints |
| `LessonListResponseDto` | `GET /lessons`, `GET /lessons/course/:courseId` |
| `EnrollmentStatusResponseDto` | `GET /courses/:id/enrollment-status` |
| `CourseRegistrationResponseDto` | `POST /courses/:id/enroll` |
| `EnrolledCourseResponseDto` | `GET /courses/enrolled` |
| `PaginatedResponse<T>` | generic list envelope |
| `UserRole` | `user` / `admin` enum |

### Dates on the wire

JSON has no `Date` type. Every timestamp field is an ISO-8601 string
(`2026-04-22T00:00:00.000Z`), because that is what a `fetch` consumer receives
after Nest serialises the backend's `Date` values.

## Contract bindings

No production contract is deployed yet, so no bindings are committed. Once a
contract such as the certificate or DAO contract exists, generate its client
from the repository root:

```bash
stellar contract build
./scripts/generate-bindings.sh <contract-wasm-name>
```

The script writes a generated client to `packages/ts-bindings/bindings/<name>/`.
How those clients are exposed from this package (sub-path exports such as
`@weacademy/bytechain-shared/certificate`, or separate packages) will be decided
when the first real contract lands.

## Development

```bash
cd packages/ts-bindings
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

| Command | Description |
|---|---|
| `npm run build` | Bundle ESM + CJS and emit `.d.ts` files |
| `npm run dev` | Rebuild on change |
| `npm run lint` | ESLint (flat config, TypeScript rules) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |

## Publishing

The `Publish ts-bindings` workflow publishes to GitHub Packages when a GitHub
release is published with a tag of the form `ts-bindings-v<version>`, for
example `ts-bindings-v0.2.0`. Bump `version` in `package.json` and
`src/version.ts` together before tagging.

## License

MIT
